@admin_bp.route('/movie_send', methods=['GET', 'POST'])
def movie_send():

    movie_id = genreted_uid(10)
    movie_name = request.form.get('movie_name', '').strip()
    movie_desc = request.form.get('movie_desc', '').strip()
    movie_access = request.form.get('movie_access', '').strip()
    movie_language = request.form.get('movie_language', '').strip()
    movie_cat = request.form.get('movie_cat', '').strip()
    movie_year = request.form.get('movie_year', '').strip()
    movie_date = request.form.get('movie_date', '').strip()
    movie_duration = request.form.get('movie_duration', '').strip()
    movie_status = request.form.get('movie_status', '').strip()
    movie_thumb = request.files.get('movie_thumb')
    movie_poster = request.files.get('movie_poster')
    seo_title = request.form.get('seo_title', '').strip()
    seo_keywords = request.form.get('seo_keywords', '').strip()
    seo_description = request.form.get('seo_description', '').strip()

    cast_type = request.form.getlist('cast_type[]')
    cast_name = request.form.getlist('cast_name[]')
    cast_role = request.form.getlist('cast_role[]')
    video_quality = request.form.getlist('video_quality[]')
    video_file = request.files.getlist('video_file[]')
    video_download = request.form.getlist('video_download[]')
    subtitle_lang = request.form.getlist('subtitle_lang[]')
    subtitle_file = request.files.getlist('subtitle_file[]')

    print("movie_name:", movie_name)
    print("cast_type:", cast_type)
    print("cast_name:", cast_name)
    print("cast_role:", cast_role)
    print("video_quality:", video_quality)
    print("video_file objects:", video_file)
    for i, vf in enumerate(video_file):
        print(f"  video_file[{i}] filename:", vf.filename if vf else None)
    print("VIDEO_FILE path:", VIDEO_FILE, "| exists:", os.path.isdir(VIDEO_FILE), "| writable:", os.access(VIDEO_FILE, os.W_OK))
    print("================================\n")


    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)

    if request.method != 'POST':
        return redirect(url_for('admin.movie_list'))

    try:
        if not movie_name:
            flash('Movie name is required.', 'warning')
            return redirect(url_for('admin.movie_list'))

        cursor.execute("SELECT * FROM `movies` WHERE movie_name = %s", (movie_name,))
        movies = cursor.fetchone()

        if movies:
            flash('Movie already exists.', 'warning')
            return redirect(url_for('admin.movie_list'))

# thumbnail save to server
        thumb_file = None
        poster_file = None

        if movie_thumb and movie_thumb.filename:
            thumb_filename = secure_filename(movie_thumb.filename)
            os.makedirs(FILE_PATH, exist_ok=True)
            thumb_path = os.path.join(FILE_PATH, thumb_filename)
            movie_thumb.save(thumb_path)
            thumb_file = thumb_filename

        if movie_poster and movie_poster.filename:
            poster_filename = secure_filename(movie_poster.filename)
            os.makedirs(FILE_PATH, exist_ok=True)
            poster_path = os.path.join(FILE_PATH, poster_filename)
            movie_poster.save(poster_path)
            poster_file = poster_filename

        movie_qurry = '''
            INSERT INTO `movies`(`movie_id`, `movie_name`, `movie_description`, `movie_access`, `movie_language`, `movie_categories`, `movie_release_date`, `movie_duration`, `movie_status`, `movie_thumbnail`, `movie_poster`, `Ishomepage`, `Isposter`, `movie_release_year`, `seo_title`, `seo_keywords`, `seo_description`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        '''
        movie_value = (movie_id, movie_name, movie_desc, movie_access, movie_language, movie_cat, movie_date, movie_duration, movie_status, thumb_file, poster_file, 0, 0, movie_year, seo_title, seo_keywords, seo_description)
        cursor.execute(movie_qurry, movie_value)

        cast_qurry = '''
            INSERT INTO `movie_cast`(`movie_id`, `movie_cast_id`, `movie_cast_type`, `movie_cast_name`, `movie_cast_role`) VALUES (%s,%s,%s,%s,%s)
        '''

        cast_rows = []
        for i in range(min(len(cast_name), len(cast_type), len(cast_role))):
            if not cast_name[i].strip():
                continue
            cast_rows.append((movie_id, genreted_uid(8), cast_type[i], cast_name[i], cast_role[i]))

        if cast_rows:
            cursor.executemany(cast_qurry, cast_rows)

                 # ---- VIDEO FILE SAVE (chunked, safe for large files) ----
        video_qurry = '''
            INSERT INTO `movie_file`(`movie_id`, `video_id`, `video_quality`, `video_file`, `video_download`)
            VALUES (%s,%s,%s,%s,%s)
        '''

        video_rows = []
        for i in range(len(video_quality)):
            vfile = video_file[i] if i < len(video_file) else None
            saved_video_name = None

            print(f"-- processing video row {i} | quality={video_quality[i]} | vfile={vfile} | filename={vfile.filename if vfile else 'NO FILE OBJECT'}")

            if vfile and vfile.filename:
                saved_video_name = secure_filename(vfile.filename)
                vpath = os.path.join(VIDEO_FILE, saved_video_name)
                print("Saving video to:", vpath)

                try:
                    CHUNK_SIZE = 8 * 1024 * 1024  # 8MB
                    bytes_written = 0
                    with open(vpath, 'wb') as f:
                        while True:
                            chunk = vfile.stream.read(CHUNK_SIZE)
                            if not chunk:
                                break
                            f.write(chunk)
                            bytes_written += len(chunk)
                    print(f"Finished writing {saved_video_name} — {bytes_written} bytes")

                    if bytes_written == 0:
                        print("!! WARNING: 0 bytes written — file stream was empty !!")
                        saved_video_name = None
                        if os.path.exists(vpath):
                            os.remove(vpath)

                except Exception as save_exc:
                    print("!! FAILED to save video file:", save_exc)
                    saved_video_name = None
            else:
                print(f"!! No file received for video_file[{i}] — check the <input> name in your HTML/JS !!")

            if not saved_video_name:
                continue

            video_id = genreted_uid(8)
            download_flag = video_download[i] if i < len(video_download) else ''
            video_rows.append((movie_id, video_id, video_quality[i], saved_video_name, download_flag))

        print("video_rows built:", video_rows)

        if video_rows:
            cursor.executemany(video_qurry, video_rows)
        else:
            print("!! No video rows to insert — nothing was written to movie_file table !!")
        

       
        # subtitle insert
       
        connction.commit()
        flash('Movie uploaded successfully.', 'success')
        return redirect(url_for('admin.movie_list'))
        
        

    except (Error, TypeError) as exc:
        connction.rollback()
        return f"{exc}"
        
    finally:
        cursor.close()
        connction.close()
        
       