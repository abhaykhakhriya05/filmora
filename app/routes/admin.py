from flask import Blueprint , redirect , render_template , request ,Response,url_for,session, flash ,current_app
from app import genreted_uid,genreted_db_connect
from mysql.connector import Error
from werkzeug.utils import  secure_filename
import os 
import traceback
import keyboard as key

print(genreted_uid)

admin_bp = Blueprint('admin',__name__)

# store a save file path in the application static folder
APP_ROOT = os.path.dirname(admin_bp.root_path)
VIDEO_FILE = os.path.join(APP_ROOT,'static', 'video')
FILE_PATH = os.path.join(APP_ROOT,'static', 'image')
SUBTITLE_PATH = os.path.join(APP_ROOT,'static', 'subtitle')
os.makedirs(FILE_PATH, exist_ok=True)
os.makedirs(VIDEO_FILE, exist_ok=True)
os.makedirs(SUBTITLE_PATH, exist_ok=True)


if key.is_pressed('M'):
    redirect(url_for('auth.login'))

@admin_bp.route('/dashboard')
def dashboard():
    if 'admin_email' not in session:
        return redirect(url_for('auth.login'))

    return render_template('admin_dashboard.html',active_page = 'dashboard')

# Categories page
@admin_bp.route('/Categories')
def Categories():
    
    if 'admin_login' not in session :
        return redirect(url_for('auth.login'))
    
    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)
    
    if connction.is_connected():
        cursor.execute("SELECT * FROM category")
        cat = cursor.fetchall()
        
        connction.close()
        cursor.close()
    
    return render_template('category.html',active_page = 'category', cat = cat)
    
        
 
# create category 
@admin_bp.route('/send_category',methods=['GET','POST'])
def send_category():
    
    if request.method == 'POST':
        # input user
         Cname = request.form.get('Cname', '').strip()
         Cslug = request.form.get('Cslug', '').strip()
         Cdescription = request.form.get('Cdescription', '').strip()
         Ctype = request.form.get('Ctype', '')
         Cdisplay = request.form.get('Cdisplay', '')
         Citems = request.form.get('Citems', '')
         Cstatus = request.form.get('Cstatus', '')
         Cicon = request.form.get('Cicon', '')
         Cfile = request.files.get('Cfile')
         
         if not Cname :
             flash("Image File Is reqvried")
             return(redirect(url_for('admin.Categories')))
           
            # conncetion object   
         connction = genreted_db_connect()
         cursor = connction.cursor()
         
            # database connction  
         if not connction.is_connected():
            cursor.close()
            connction.close()
            flash('Database connection failed.', 'danger')
            return redirect(url_for('admin.Categories'))
         
        #  fetch file categories name to database
         cursor.execute("SELECT * FROM `category` WHERE category_name = %s", (Cname,))
         categories = cursor.fetchone()

         if categories:
            cursor.close()
            connction.close()
            flash('Category already exists.', 'warning')
            return redirect(url_for('admin.Categories'))
        
        # save a file server
         uploaded_file = None
         if Cfile and Cfile.filename:
                filename = secure_filename(Cfile.filename)
                if filename:
                    os.makedirs(FILE_PATH, exist_ok=True)
                    save_path = os.path.join(FILE_PATH, filename)
                    Cfile.save(save_path)
                    uploaded_file = filename


            #  data insert to category database
         Cqurey = '''INSERT INTO `category`(`category_name`, `slug`, `category_description`, `category_type`, `category_display`, `tems`, `category_status`, `category_Icon`, `category_thumbnail`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
         Cvalue = (Cname, Cslug, Cdescription, Ctype, Cdisplay, Citems, Cstatus, Cicon, uploaded_file)
         cursor.execute(Cqurey, Cvalue)
         connction.commit()
         cursor.close()
         connction.close()

         flash('Category saved successfully.', 'success')
         return redirect(url_for('admin.Categories'))


# category delete
@admin_bp.route('/delete_category/<int:ct_id>')
def delete_category(ct_id):
    # database connect object
    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)

    try:
        if not connction.is_connected():
            flash('Database connection failed.', 'danger')
            return redirect(url_for('admin.Categories'))

        # fetch data to ct_id
        cursor.execute("SELECT category_thumbnail FROM `category` WHERE c_id = %s", (ct_id,))
        row = cursor.fetchone()

        # remove the file to server
        if row and row.get('category_thumbnail'):
            filename = secure_filename(row['category_thumbnail'])
            file_path = os.path.join(FILE_PATH, filename)
            if os.path.exists(file_path):
                os.remove(file_path)

        # database delete record to catogories table
        cursor.execute("DELETE FROM `category` WHERE c_id = %s", (ct_id,))
        connction.commit()
        flash('Category deleted successfully.', 'success')
    except Exception:
        flash('Error deleting category.', 'danger')
    finally:
        cursor.close()
        connction.close()

    return redirect(url_for('admin.Categories'))


# movie desshborad 

@admin_bp.route('/movie_list')
def movie_list():
    if 'admin_login' not in session:
        return redirect(url_for('auth.login'))
    
    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)
    
    if connction.is_connected():
        cursor.execute("SELECT `category_name` FROM category")
        cate = cursor.fetchall()

        cursor.execute("SELECT * FROM movies")
        movies = cursor.fetchall()
        
    
    return render_template('movie_list.html',cate=cate,movies=movies)


@admin_bp.route('/movie_edit/<movie_id>')
def movie_edit(movie_id):
    if 'admin_login' not in session:
        return redirect(url_for('auth.login'))

    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)

    try:
        if not connction.is_connected():
            flash('Database connection failed.', 'danger')
            return redirect(url_for('admin.movie_list'))

        cursor.execute("SELECT `category_name` FROM category")
        cate = cursor.fetchall()

        cursor.execute("SELECT * FROM movies WHERE movie_id = %s", (movie_id,))
        movie = cursor.fetchone()

        if not movie:
            flash('Movie not found.', 'warning')
            return redirect(url_for('admin.movie_list'))

        cursor.execute("SELECT * FROM movie_cast WHERE movie_id = %s", (movie_id,))
        cast = cursor.fetchall()

        cursor.execute("SELECT * FROM movie_file WHERE movie_id = %s", (movie_id,))
        videos = cursor.fetchall()

        cursor.execute("SELECT * FROM movie_subtitles WHERE movie_id = %s", (movie_id,))
        subtitles = cursor.fetchall()

        return render_template(
            'movie_edit.html',
            cate=cate,
            movie=movie,
            cast=cast,
            videos=videos,
            subtitles=subtitles,
        )
    except Exception as exc:
        print(f"Error loading movie edit page: {exc}")
        flash('Error loading movie edit page.', 'danger')
        return redirect(url_for('admin.movie_list'))
    finally:
        cursor.close()
        connction.close()


@admin_bp.route('/movie_update/<movie_id>', methods=['POST'])
def movie_update(movie_id):
    if 'admin_login' not in session:
        return redirect(url_for('auth.login'))

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

    if not movie_name:
        flash('Movie name is required.', 'warning')
        return redirect(url_for('admin.movie_edit', movie_id=movie_id))

    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)

    try:
        if not connction.is_connected():
            flash('Database connection failed.', 'danger')
            return redirect(url_for('admin.movie_edit', movie_id=movie_id))

        cursor.execute("SELECT * FROM movies WHERE movie_id = %s", (movie_id,))
        movie = cursor.fetchone()

        if not movie:
            flash('Movie not found.', 'warning')
            return redirect(url_for('admin.movie_list'))

        thumb_file = movie.get('movie_thumbnail')
        poster_file = movie.get('movie_poster')

        if movie_thumb and movie_thumb.filename:
            thumb_filename = secure_filename(movie_thumb.filename)
            movie_thumb.save(os.path.join(FILE_PATH, thumb_filename))
            if thumb_file and thumb_file != thumb_filename:
                old_thumb = os.path.join(FILE_PATH, secure_filename(thumb_file))
                if os.path.exists(old_thumb):
                    os.remove(old_thumb)
            thumb_file = thumb_filename

        if movie_poster and movie_poster.filename:
            poster_filename = secure_filename(movie_poster.filename)
            movie_poster.save(os.path.join(FILE_PATH, poster_filename))
            if poster_file and poster_file != poster_filename:
                old_poster = os.path.join(FILE_PATH, secure_filename(poster_file))
                if os.path.exists(old_poster):
                    os.remove(old_poster)
            poster_file = poster_filename

        movie_qurry = '''
            UPDATE movies
            SET movie_name = %s,
                movie_description = %s,
                movie_access = %s,
                movie_language = %s,
                movie_categories = %s,
                movie_release_date = %s,
                movie_duration = %s,
                movie_status = %s,
                movie_thumbnail = %s,
                movie_poster = %s,
                movie_release_year = %s,
                seo_title = %s,
                seo_keywords = %s,
                seo_description = %s
            WHERE movie_id = %s
        '''
        movie_value = (
            movie_name,
            movie_desc,
            movie_access,
            movie_language,
            movie_cat,
            movie_date,
            movie_duration,
            movie_status,
            thumb_file,
            poster_file,
            movie_year,
            seo_title,
            seo_keywords,
            seo_description,
            movie_id,
        )
        cursor.execute(movie_qurry, movie_value)

        cursor.execute("DELETE FROM movie_cast WHERE movie_id = %s", (movie_id,))
        cast_rows = []
        cast_type = request.form.getlist('cast_type[]')
        cast_name = request.form.getlist('cast_name[]')
        cast_role = request.form.getlist('cast_role[]')

        for i in range(min(len(cast_name), len(cast_type), len(cast_role))):
            if not cast_name[i].strip():
                continue
            cast_rows.append((movie_id, genreted_uid(8), cast_type[i], cast_name[i], cast_role[i]))

        if cast_rows:
            cursor.executemany('''
                INSERT INTO movie_cast(movie_id, movie_cast_id, movie_cast_type, movie_cast_name, movie_cast_role)
                VALUES (%s,%s,%s,%s,%s)
            ''', cast_rows)

        cursor.execute("SELECT movie_file FROM movie_file WHERE movie_id = %s", (movie_id,))
        current_videos = cursor.fetchall()
        existing_video_files = request.form.getlist('existing_video_file[]')

        for row in current_videos:
            filename = row.get('movie_file')
            if filename and filename not in existing_video_files:
                video_path = os.path.join(VIDEO_FILE, secure_filename(filename))
                if os.path.exists(video_path):
                    os.remove(video_path)

        cursor.execute("DELETE FROM movie_file WHERE movie_id = %s", (movie_id,))
        video_rows = []
        existing_video_quality = request.form.getlist('existing_video_quality[]')
        existing_video_download = request.form.getlist('existing_video_download[]')

        for i, filename in enumerate(existing_video_files):
            if not filename:
                continue
            quality = existing_video_quality[i] if i < len(existing_video_quality) else ''
            download = existing_video_download[i] if i < len(existing_video_download) else ''
            video_rows.append((movie_id, genreted_uid(8), quality, filename, download))

        video_quality = request.form.getlist('video_quality[]')
        video_file = request.files.getlist('video_file[]')
        video_download = request.form.getlist('video_download[]')

        for i in range(len(video_quality)):
            vfile = video_file[i] if i < len(video_file) else None
            if not vfile or not vfile.filename:
                continue
            saved_video_name = secure_filename(vfile.filename)
            vfile.save(os.path.join(VIDEO_FILE, saved_video_name))
            download = video_download[i] if i < len(video_download) else ''
            video_rows.append((movie_id, genreted_uid(8), video_quality[i], saved_video_name, download))

        if video_rows:
            cursor.executemany('''
                INSERT INTO movie_file(movie_id, movie_file_id, movie_quality, movie_file, movie_download)
                VALUES (%s,%s,%s,%s,%s)
            ''', video_rows)

        cursor.execute("SELECT movie_subtitle FROM movie_subtitles WHERE movie_id = %s", (movie_id,))
        current_subtitles = cursor.fetchall()
        existing_subtitle_files = request.form.getlist('existing_subtitle_file[]')

        for row in current_subtitles:
            filename = row.get('movie_subtitle')
            if filename and filename not in existing_subtitle_files:
                subtitle_path = os.path.join(SUBTITLE_PATH, secure_filename(filename))
                if os.path.exists(subtitle_path):
                    os.remove(subtitle_path)

        cursor.execute("DELETE FROM movie_subtitles WHERE movie_id = %s", (movie_id,))
        subtitle_rows = []
        existing_subtitle_lang = request.form.getlist('existing_subtitle_lang[]')

        for i, filename in enumerate(existing_subtitle_files):
            if not filename:
                continue
            language = existing_subtitle_lang[i] if i < len(existing_subtitle_lang) else ''
            subtitle_rows.append((movie_id, genreted_uid(8), language, filename))

        subtitle_lang = request.form.getlist('subtitle_lang[]')
        subtitle_file = request.files.getlist('subtitle_file[]')

        for i in range(len(subtitle_lang)):
            sfile = subtitle_file[i] if i < len(subtitle_file) else None
            if not sfile or not sfile.filename:
                continue
            saved_subtitle_name = secure_filename(sfile.filename)
            sfile.save(os.path.join(SUBTITLE_PATH, saved_subtitle_name))
            subtitle_rows.append((movie_id, genreted_uid(8), subtitle_lang[i], saved_subtitle_name))

        if subtitle_rows:
            cursor.executemany('''
                INSERT INTO movie_subtitles(movie_id, movie_subtitle_id, movie_sub_language, movie_subtitle)
                VALUES (%s,%s,%s,%s)
            ''', subtitle_rows)

        connction.commit()
        flash('Movie updated successfully.', 'success')
        return redirect(url_for('admin.movie_list'))

    except Exception as exc:
        connction.rollback()
        traceback.print_exc()
        flash(f'Error updating movie: {exc}', 'danger')
        return redirect(url_for('admin.movie_edit', movie_id=movie_id))
    finally:
        cursor.close()
        connction.close()




@admin_bp.route('/movie_send', methods=['GET', 'POST'])
def movie_send():

    if request.method != 'POST':
        return redirect(url_for('admin.movie_list'))

    print("\n===== MOVIE_SEND CALLED =====")
    print("Content-Length:", request.content_length)
    print("Form keys:", list(request.form.keys()))
    print("Files keys:", list(request.files.keys()))

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
    print("video_download:", video_download)
    print("video_file objects:", video_file)
    for i, vf in enumerate(video_file):
        print(f"  video_file[{i}] filename:", vf.filename if vf else None)
    print("subtitle_lang:", subtitle_lang)
    for i, sf in enumerate(subtitle_file):
        print(f"  subtitle_file[{i}] filename:", sf.filename if sf else None)
    print("VIDEO_FILE path:", VIDEO_FILE, "| exists:", os.path.isdir(VIDEO_FILE), "| writable:", os.access(VIDEO_FILE, os.W_OK))
    print("================================\n")

    if not movie_name:
        flash('Movie name is required.', 'warning')
        return redirect(url_for('admin.movie_list'))

    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)

    try:
        if not connction.is_connected():
            flash('Database connection failed.', 'danger')
            return redirect(url_for('admin.movie_list'))

        cursor.execute("SELECT * FROM `movies` WHERE movie_name = %s", (movie_name,))
        movies = cursor.fetchone()

        if movies:
            flash('Movie already exists.', 'warning')
            return redirect(url_for('admin.movie_list'))

        # ---- THUMBNAIL / POSTER ----
        thumb_file = None
        poster_file = None

        if movie_thumb and movie_thumb.filename:
            thumb_filename = secure_filename(movie_thumb.filename)
            thumb_path = os.path.join(FILE_PATH, thumb_filename)
            movie_thumb.save(thumb_path)
            thumb_file = thumb_filename

        if movie_poster and movie_poster.filename:
            poster_filename = secure_filename(movie_poster.filename)
            poster_path = os.path.join(FILE_PATH, poster_filename)
            movie_poster.save(poster_path)
            poster_file = poster_filename

        movie_qurry = '''
            INSERT INTO `movies`(`movie_id`, `movie_name`, `movie_description`, `movie_access`, `movie_language`, `movie_categories`, `movie_release_date`, `movie_duration`, `movie_status`, `movie_thumbnail`, `movie_poster`, `Ishomepage`, `Isposter`, `movie_release_year`, `seo_title`, `seo_keywords`, `seo_description`)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        '''
        movie_value = (movie_id, movie_name, movie_desc, movie_access, movie_language, movie_cat,
                        movie_date, movie_duration, movie_status, thumb_file, poster_file,
                        0, 0, movie_year, seo_title, seo_keywords, seo_description)
        cursor.execute(movie_qurry, movie_value)
        print("Movie row inserted (pending commit), movie_id:", movie_id)

        # ---- CAST / CREW ----
        cast_qurry = '''
            INSERT INTO `movie_cast`(`movie_id`, `movie_cast_id`, `movie_cast_type`, `movie_cast_name`, `movie_cast_role`)
            VALUES (%s,%s,%s,%s,%s)
        '''
        cast_rows = []
        for i in range(min(len(cast_name), len(cast_type), len(cast_role))):
            if not cast_name[i].strip():
                continue
            cast_rows.append((movie_id, genreted_uid(8), cast_type[i], cast_name[i], cast_role[i]))

        print("cast_rows built:", cast_rows)

        if cast_rows:
            cursor.executemany(cast_qurry, cast_rows)
        else:
            print("!! No cast rows to insert !!")

        # ---- VIDEO FILES (chunked save for large files) ----
        video_qurry = '''
            INSERT INTO `movie_file`(`movie_id`, `movie_file_id`, `movie_quality`, `movie_file`, `movie_download`)
            VALUES (%s,%s,%s,%s,%s)
        '''

        video_rows = []
        for i in range(len(video_quality)):
            vfile = video_file[i] if i < len(video_file) else None
            saved_video_name = None

            print(f"-- processing video row {i} | quality={video_quality[i]} | filename={vfile.filename if vfile else 'NO FILE OBJECT'}")

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
                        print("!! WARNING: 0 bytes written !!")
                        saved_video_name = None
                        if os.path.exists(vpath):
                            os.remove(vpath)

                except Exception as save_exc:
                    print("!! FAILED to save video file:", save_exc)
                    saved_video_name = None
            else:
                print(f"!! No file received for video_file[{i}] !!")

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

        # ---- SUBTITLES ----
        subtitle_qurry = '''
            INSERT INTO `movie_subtitles`(`movie_id`, `movie_subtitle_id`, `movie_sub_language`, `movie_subtitle`)
            VALUES (%s,%s,%s,%s)
        '''
        subtitle_rows = []
        for i in range(len(subtitle_lang)):
            sfile = subtitle_file[i] if i < len(subtitle_file) else None
            saved_subtitle_name = None

            if sfile and sfile.filename:
                saved_subtitle_name = secure_filename(sfile.filename)
                spath = os.path.join(SUBTITLE_PATH, saved_subtitle_name)
                sfile.save(spath)

            if not saved_subtitle_name:
                continue

            subtitle_id = genreted_uid(8)
            subtitle_rows.append((movie_id, subtitle_id, subtitle_lang[i], saved_subtitle_name))

        print("subtitle_rows built:", subtitle_rows)

        if subtitle_rows:
            cursor.executemany(subtitle_qurry, subtitle_rows)

        connction.commit()
        print("===== COMMIT SUCCESSFUL =====\n")
        flash('Movie uploaded successfully.', 'success')
        return redirect(url_for('admin.movie_list'))

    except Exception as exc:
        connction.rollback()
        print("!!!!! EXCEPTION — ROLLED BACK !!!!!")
        traceback.print_exc()
        flash(f'Error uploading movie: {exc}', 'danger')
        return redirect(url_for('admin.movie_list'))

    finally:
        cursor.close()
        connction.close()


# movie delete 

@admin_bp.route("/delete_movie/<movie_id>")
def delete_movie(movie_id):
    
    conncetion = genreted_db_connect()
    cursor = conncetion.cursor(dictionary=True)

    try:

        cursor.execute("SELECT (movie_thumbnail) FROM `movies` WHERE movie_id = %s ",(movie_id,))
        movie = cursor.fetchone()

        if movie and movie.get("movie_thumbnail"):
            filename = secure_filename(movie['movie_thumbnail'])
            file_path = os.path.join(FILE_PATH,filename)
            if os.path.exists(file_path):
                os.remove(file_path)

        cursor.execute("SELECT (movie_poster) FROM `movies` WHERE movie_id = %s ",(movie_id,))
        movie_poster = cursor.fetchone()

        if movie_poster and movie_poster.get("movie_poster"):
            poster_file_name = secure_filename(movie_poster["movie_poster"])
            poster_file_path = os.path.join(FILE_PATH,poster_file_name)
            if os.path.exists(poster_file_path):
                os.remove(poster_file_path)

        cursor.execute("DELETE FROM `movies` WHERE movie_id = %s",(movie_id,))

        cursor.execute("DELETE FROM `movie_cast` WHERE movie_id = %s",(movie_id,))

        cursor.execute("SELECT movie_file FROM movie_file WHERE movie_id = %s",(movie_id,))
        movie_file = cursor.fetchall()

        for file in movie_file:
            if file and file.get('movie_file'):
                file_name = secure_filename(file['movie_file'])
                movie_file_path = os.path.join(VIDEO_FILE,file_name)
                if os.path.exists(movie_file_path):
                    os.remove(movie_file_path)

        cursor.execute("DELETE FROM movie_file WHERE movie_id = %s",(movie_id,))

        cursor.execute("SELECT movie_subtitle FROM movie_subtitles WHERE movie_id = %s",(movie_id,))
        subtitles = cursor.fetchall()

        for subtitle in subtitles :
            if subtitle and subtitle.get("movie_subtitle"):
                subtitle_file_name = secure_filename(subtitle["movie_subtitle"])
                subtitle_path = os.path.join(SUBTITLE_PATH,subtitle_file_name)
                if os.path.exists(subtitle_path):
                    os.remove(subtitle_path)

        cursor.execute("DELETE FROM `movie_subtitles` WHERE movie_id = %s",(movie_id,))

        conncetion.commit()
        flash('Movie Deleted Successfully.', 'success')
        return redirect(url_for('admin.movie_list'))

    except Exception as e :
        conncetion.rollback()
        print(f"the error is {e}")
        return redirect(url_for('admin.movie_list'))
       
    finally:
        conncetion.close()
        cursor.close()


@admin_bp.route('/show_series')
def show_series():
    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM category WHERE category_type = 'Movies & Series' OR category_type = 'Series'")
        cat = cursor.fetchall()

        cursor.execute("SELECT * FROM `series`")
        series = cursor.fetchall()

    except Exception as e:
        flash(f'error is {e}')

    return render_template('show_series.html',active_page = 'show_series', cat = cat , series = series)

@admin_bp.route("/add_series", methods=['GET', 'POST'])
def add_series():

   Sname = request.form.get("Sname")
   Sdecc = request.form.get("Sdecc")
   Saccess = request.form.get("Saccess")
   Slanguage = request.form.get("Slanguage")
   Scat = request.form.get("Scat")
   Sststus = request.form.get("Sststus")
   Sseasons = request.form.get("Sseasons")
   Sepisodes = request.form.get("Sepisodes")
   Syear = request.form.get("Syear")
   Sdate = request.form.get("Sdate")
   Srating = request.form.get("Srating")
   seo_title = request.form.get("seo_title")
   seo_desc = request.form.get("seo_desc")
   seo_keyword = request.form.get("seo_keyword")
   Sthumb = request.files.get("Sthumb")
   Strailer = request.form.get("Strailer")
   Sposter = request.files.get("Sposter")
   series_id = genreted_uid(12)

   if request.method == 'POST':
       try:
           connection = genreted_db_connect()
           cursor = connection.cursor(dictionary=True)

           cursor.execute("SELECT * FROM series WHERE series_name = %s",(Sname,))
           series = cursor.fetchone()

           print(Strailer)

           if series:
               flash("This series Already Exist","danger")

           thumb_file = None
           poster_file = None

           if Sthumb and Sthumb.filename:
               thumb_filename = secure_filename(Sthumb.filename)
               thumb_path = os.path.join(FILE_PATH,thumb_filename)
               Sthumb.save(thumb_path)
               thumb_file = thumb_filename

           if Sposter and Sposter.filename:
               poster_filename = Sposter.filename
               poster_path = os.path.join(FILE_PATH,poster_filename)
               Sposter.save(poster_path)
               poster_file = poster_filename

           sql_qurry = '''
                INSERT INTO `series`(`series_id`, `series_name`, `series_description`, `series_access`, `series_language`, `series_category`, `series_status`, `series_seasons`, `series_episodes`, `series_release_year`, `series_release_date`, `series_rating`, `seo_title`, `seo_description`, `seo_keywords`, `series_thumbnail`, `series_Poster`, `series_trailer_url`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            '''
           sql_valus = (series_id,Sname,Sdecc,Saccess,Slanguage,Scat,Sststus,Sseasons,Sepisodes,Syear,Sdate,Srating,seo_title,seo_desc,seo_keyword,thumb_file,poster_file,Strailer)

           cursor.execute(sql_qurry,sql_valus)
           connection.commit()

           flash('Series Uplodeed Successfully.', 'success')
           return redirect(url_for('admin.show_series'))
       
       except Exception as e:
           
          
           return f'''Series Uplodeed error {e} .'''

       finally:
           connection.close()
           cursor.close()

@admin_bp.route("/seasons")
def seasons():

    try:
        connection = genreted_db_connect()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT series_id, series_name FROM series ORDER BY series_name")
        series = cursor.fetchall()

        cursor.execute("SELECT * FROM season")
        season = cursor.fetchall()
    except Exception as e:
        flash(f'Error loading series: {e}', 'danger')
        return redirect(url_for('admin.seasons'))
    finally:
        connection.close()
        cursor.close()

    return render_template("seasons.html", active_page = 'seasons',series = series, season = season)

@admin_bp.route("/add_seasons", methods = ["GET","POST"])
def add_seasons():

    if request.method != "POST":
        return redirect(url_for('admin.seasons'))

    seasonSeries = request.form.get("season_series_id", "").strip()
    seasonName = request.form.get("seasonName")
    seasonDescription = request.form.get("seasonDescription")
    seasonNumber = request.form.get("seasonNumber")
    seasonEpisodes = request.form.get("seasonEpisodes")
    seasonYear = request.form.get("seasonYear")
    seasonDate = request.form.get("seasonDate")
    seasonStatus = request.form.get("seasonStatus")
    seasonAccess = request.form.get("seasonAccess")
    seasonPoster = request.files.get("seasonPoster")
    seasonId = genreted_uid(11)
    
    if request.method == "POST":

        connection = genreted_db_connect()
        cursor = connection.cursor()

        try:
            
            
            cursor.execute("SELECT series_name,series_id FROM series WHERE series_id = %s",(seasonSeries,))
            series = cursor.fetchone()
           

            if not series:
                flash("Selected series not found.", "danger")
                return redirect(url_for('admin.seasons'))

            poster_file = None
            if seasonPoster and seasonPoster.filename:
                poster_filename = secure_filename(seasonPoster.filename)
                poster_path = os.path.join(FILE_PATH,poster_filename)
                seasonPoster.save(poster_path)
                poster_file = poster_filename

            sql_qurry = '''
                INSERT INTO season (season_id,series_id,seasonName,seasonDescription,seasonNumber,seasonEpisodes,seasonYear,seasonDate,seasonStatus,seasonAccess,seasonPoster,seasonSeries)VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            '''

            sql_valus = (seasonId,seasonSeries,seasonName,seasonDescription,seasonNumber,seasonEpisodes,seasonYear,seasonDate,seasonStatus,seasonAccess,poster_file,series[0])

            cursor.execute(sql_qurry,sql_valus)
            connection.commit()

            flash("Season Uplode Successfully","success")
            return redirect(url_for('admin.seasons'))
        except Exception as e :
            connection.rollback()
            # flash(f"Season Uplode Error {e}","denger")
            return f"Season Uplode Error {e}"
        finally:
            connection.close()
            cursor.close()

# @admin_bp.route("/episodes")
# def episodes():

#     try:
#         connection = genreted_db_connect()
#         cursor = connection.cursor(dictionary=True)

#         cursor.execute("SELECT * FROM `series`")
#         series = cursor.fetchall()
#         print(series)

#         cursor.execute("SELECT * FROM `season`")
#         season = cursor.fetchall()
#         print(season)
#     except Exception as e:
#         flash(f"Error{e}")
#         return redirect(url_for("admin.episodes"))
#     finally:
#         connection.close()
#         cursor.close()
#     return render_template("episodes.html",active_page = "episodes",series = series , season = season)

# @admin_bp.route("/add_episode",methods = ['GET','POST'])
# def add_episode():

@admin_bp.route("/episodes")
def episodes():
    connection = None
    cursor = None
    try:
        connection = genreted_db_connect()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT series_id, series_name FROM `series` ORDER BY series_name")
        series = cursor.fetchall()

        cursor.execute("SELECT season_id, series_id, seasonName, seasonNumber FROM `season` ORDER BY seasonNumber")
        season = cursor.fetchall()

        cursor.execute('''
            SELECT e.*, s.series_name, se.seasonName, se.seasonNumber
            FROM episode AS e
            JOIN series AS s ON s.series_id = e.series_id
            JOIN season AS se ON se.season_id = e.season_id
            ORDER BY e.episodeReleaseDate DESC, e.episodeNumber ASC
        ''')
        episode_list = cursor.fetchall()
    except Exception as e:
        flash(f"Error loading episodes: {e}", "danger")
        series, season, episode_list = [], [], []
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    return render_template("episodes.html", active_page="episodes", series=series,
                           season=season, episodes=episode_list)


@admin_bp.route("/add_episode", methods=["POST"])
def add_episode():
    """Save an episode and its optional videos, subtitles, and cast/crew."""
    series_id = request.form.get("episodeSeries", "").strip()
    season_id = request.form.get("episodeSeason", "").strip()
    episode_name = request.form.get("episodeName", "").strip()
    episode_description = request.form.get("episodeDescription", "").strip()
    episode_number = request.form.get("episodeNumber", "").strip()
    episode_duration = request.form.get("episodeDuration", "").strip()
    release_date = request.form.get("episodeReleaseDate", "").strip() or None
    episode_status = request.form.get("episodeStatus", "draft").strip().lower()
    episode_access = request.form.get("episodeAccess", "Free").strip()
    thumbnail = request.files.get("episodeThumb")
   

    if not all((series_id, season_id, episode_name, episode_number)):
        flash("Series, season, episode title, and episode number are required.", "warning")
        return redirect(url_for("admin.episodes"))

    if episode_status not in {"published", "draft"}:
        flash("Invalid episode status.", "warning")
        return redirect(url_for("admin.episodes"))

    connection = None
    cursor = None
    try:
        connection = genreted_db_connect()
        cursor = connection.cursor(dictionary=True)

        # A season must belong to the selected series; never trust IDs from the form.
        cursor.execute(
            "SELECT season_id FROM season WHERE season_id = %s AND series_id = %s",
            (season_id, series_id),
        )
        if not cursor.fetchone():
            flash("The selected season does not belong to that series.", "warning")
            return redirect(url_for("admin.episodes"))

        cursor.execute(
            "SELECT episode_id FROM episode WHERE season_id = %s AND episodeNumber = %s",
            (season_id, episode_number),
        )
        if cursor.fetchone():
            flash("That episode number already exists in this season.", "warning")
            return redirect(url_for("admin.episodes"))

        episode_id = genreted_uid(12)
        thumbnail_name = None
        if thumbnail and thumbnail.filename:
            original_name = secure_filename(thumbnail.filename)
            if original_name:
                thumbnail_name = f"{episode_id}_{original_name}"
                thumbnail.save(os.path.join(FILE_PATH, thumbnail_name))

        cursor.execute('''
            INSERT INTO episode
                (episode_id, series_id, season_id, episodeName, episodeDescription,
                 episodeNumber, episodeDuration, episodeReleaseDate, episodeStatus,
                 episodeAccess, episodeThumb)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (episode_id, series_id, season_id, episode_name, episode_description,
              episode_number, episode_duration, release_date, episode_status,
              episode_access, thumbnail_name))

        video_qualities = request.form.getlist("episodeVideoQuality[]")
        video_files = request.files.getlist("episodeVideoFile[]")
        video_downloads = request.form.getlist("episodeVideoDownload[]")
        for index, video in enumerate(video_files):
            if not video or not video.filename:
                continue
            filename = secure_filename(video.filename)
            if not filename:
                continue
            saved_name = f"{episode_id}_{genreted_uid(6)}_{filename}"
            video.save(os.path.join(VIDEO_FILE, saved_name))
            cursor.execute('''
                INSERT INTO episode_file (episode_file_id, episode_id, episode_quality, episode_file, episode_download)
                VALUES (%s, %s, %s, %s, %s)
            ''', (genreted_uid(10), episode_id,
                  video_qualities[index] if index < len(video_qualities) else "",
                  saved_name,
                  video_downloads[index] if index < len(video_downloads) else "Disabled"))

        subtitle_languages = request.form.getlist("episodeSubtitleLanguage[]")
        subtitle_files = request.files.getlist("episodeSubtitleFile[]")
        for index, subtitle in enumerate(subtitle_files):
            if not subtitle or not subtitle.filename:
                continue
            filename = secure_filename(subtitle.filename)
            if not filename:
                continue
            saved_name = f"{episode_id}_{genreted_uid(6)}_{filename}"
            subtitle.save(os.path.join(SUBTITLE_PATH, saved_name))
            cursor.execute('''
                INSERT INTO episode_subtitles (episode_subtitle_id, episode_id, episode_sub_language, episode_subtitle)
                VALUES (%s, %s, %s, %s)
            ''', (genreted_uid(10), episode_id,
                  subtitle_languages[index] if index < len(subtitle_languages) else "",
                  saved_name))

        cast_types = request.form.getlist("episodeCastType[]")
        cast_names = request.form.getlist("episodeCastName[]")
        cast_roles = request.form.getlist("episodeCastRole[]")
        for index, cast_name in enumerate(cast_names):
            if not cast_name.strip():
                continue
            cursor.execute('''
                INSERT INTO episode_cast (episode_cast_id, episode_id, episode_cast_type, episode_cast_name, episode_cast_role)
                VALUES (%s, %s, %s, %s, %s)
            ''', (genreted_uid(10), episode_id,
                  cast_types[index] if index < len(cast_types) else "Cast",
                  cast_name.strip(),
                  cast_roles[index].strip() if index < len(cast_roles) else ""))

        connection.commit()
        flash("Episode added successfully.", "success")
    except Exception as exc:
        if connection:
            connection.rollback()
        current_app.logger.exception("Unable to add episode")
        flash(f"Could not add episode: {exc}", "danger")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    return redirect(url_for("admin.episodes"))
    


@admin_bp.route("/users")
def users():
    if 'admin_email' not in session:
        return redirect(url_for('auth.login'))

    connection = genreted_db_connect()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute("SELECT * FROM `users`")
        users = cursor.fetchall()
    except Exception as e:
        flash(f"Error {e}","danger")
    finally:
        cursor.close()
        connection.close()

    return render_template("users.html",active_page = "users",users = users)

                

            



