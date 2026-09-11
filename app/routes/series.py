from flask import Blueprint, abort, flash, render_template, request, url_for,redirect,session
from app import genreted_db_connect,genreted_uid


series_bp = Blueprint("series", __name__)


@series_bp.route("/series")
def series():
    connection = cursor = None
    series_data = upcoming_series_data = most_reviewed_series_data = []
    anime_series_data = poster_series_data = []
    try:
        connection = genreted_db_connect()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM series WHERE series_release_date <= NOW() ORDER BY series_release_date DESC LIMIT 10")
        series_data = cursor.fetchall()
        cursor.execute("SELECT * FROM series WHERE series_release_date > NOW() ORDER BY series_release_date ASC LIMIT 10")
        upcoming_series_data = cursor.fetchall()
        cursor.execute("SELECT * FROM series WHERE series_release_date <= NOW() ORDER BY view DESC LIMIT 10")
        most_reviewed_series_data = cursor.fetchall()
        cursor.execute("SELECT * FROM series WHERE series_release_date <= NOW() AND series_category = 'Anime' ORDER BY RAND() LIMIT 10")
        anime_series_data = cursor.fetchall()
        cursor.execute("SELECT * FROM series WHERE series_release_date <= NOW() AND isPoster = 1")
        poster_series_data = cursor.fetchall()
    except Exception as exc:
        flash(f"Error fetching series: {exc}", "danger")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    return render_template("series.html", active_page="series", series_data=series_data,
                           upcoming_series_data=upcoming_series_data,
                           most_reviewed_series_data=most_reviewed_series_data,
                           poster_series_data=poster_series_data, anime_series_data=anime_series_data)


@series_bp.route("/series/<series_id>")
def series_detail(series_id):
    """Show a series, its seasons, and a playable episode list."""
    connection = cursor = None
    series_detail = None
    season_data = []
    episode_data = []
    player_settings = {}
    try:
        connection = genreted_db_connect()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM series WHERE series_id = %s", (series_id,))
        series_detail = cursor.fetchone()
        if not series_detail:
            abort(404)

        cursor.execute("SELECT * FROM season WHERE series_id = %s ORDER BY seasonNumber ASC, seasonName ASC", (series_id,))
        season_data = cursor.fetchall()

        # Attach one uploaded video to every episode.  The old code incorrectly
        # passed a list of episode IDs to a query that accepts one ID.
        cursor.execute("""
            SELECT e.*, ef.episode_file, ef.episode_quality, ef.episode_download
            FROM episode AS e
            JOIN season AS s ON s.season_id = e.season_id
            LEFT JOIN (
                SELECT episode_id, MIN(episode_file_id) AS episode_file_id
                FROM episode_file GROUP BY episode_id
            ) AS first_file ON first_file.episode_id = e.episode_id
            LEFT JOIN episode_file AS ef ON ef.episode_file_id = first_file.episode_file_id
            WHERE e.series_id = %s
            ORDER BY s.seasonNumber ASC, e.episodeNumber ASC
        """, (series_id,))
        episode_data = cursor.fetchall()

        if episode_data:
            episode_ids = [episode["episode_id"] for episode in episode_data]
            placeholders = ", ".join(["%s"] * len(episode_ids))
            cursor.execute(
                f"SELECT * FROM episode_cast WHERE episode_id IN ({placeholders}) ORDER BY episode_cast_name",
                tuple(episode_ids),
            )
            cast_by_episode = {}
            for member in cursor.fetchall():
                cast_by_episode.setdefault(member["episode_id"], []).append(member)
            for episode in episode_data:
                episode["episode_cast"] = cast_by_episode.get(episode["episode_id"], [])

            cursor.execute(
                f"SELECT * FROM episode_file WHERE episode_id IN ({placeholders}) ORDER BY episode_quality DESC",
                tuple(episode_ids),
            )
            files_by_episode = {}
            for file_row in cursor.fetchall():
                files_by_episode.setdefault(file_row["episode_id"], []).append(file_row)

            cursor.execute(
                f"SELECT * FROM episode_subtitles WHERE episode_id IN ({placeholders}) ORDER BY episode_sub_language",
                tuple(episode_ids),
            )
            subtitles_by_episode = {}
            for subtitle in cursor.fetchall():
                subtitles_by_episode.setdefault(subtitle["episode_id"], []).append(subtitle)

            for episode in episode_data:
                episode["episode_files"] = files_by_episode.get(episode["episode_id"], [])
                episode["episode_subtitles"] = subtitles_by_episode.get(episode["episode_id"], [])
                player_settings[episode["episode_id"]] = {
                    "files": [{
                        "quality": file_row["episode_quality"] or "Auto",
                        "src": url_for("static", filename="video/" + file_row["episode_file"]),
                    } for file_row in episode["episode_files"]],
                    "subtitles": [{
                        "label": subtitle["episode_sub_language"],
                        "src": url_for("static", filename="subtitle/" + subtitle["episode_subtitle"]),
                    } for subtitle in episode["episode_subtitles"]],
                }
    except Exception as exc:
        if getattr(exc, "code", None) == 404:
            raise
        flash(f"Error fetching series details: {exc}", "danger")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    requested_episode = request.args.get("episode", "")
    selected_episode = next((episode for episode in episode_data if episode["episode_id"] == requested_episode), None)
    if selected_episode is None and episode_data:
        selected_episode = episode_data[0]

    return render_template("series_view.html", active_page="series", series_detail=series_detail,
                           season_data=season_data, episode_data=episode_data,
                           selected_episode=selected_episode, player_settings=player_settings)


# @series_bp.route("/wishlist/<item_type>/<item_id>")
# def wishlist(item_type,item_id):
    
#     try:
#         connection = genreted_db_connect()
#         cursor = connection.cursor()

    

#         if "email" not in session:
#             flash("Please login first.","danger")
#             return redirect("auth.login")

#         if item_type not in ["movie", "series"]:
#             return "Invalid item type", 400

#         wishlist_id = genreted_uid(13)

#         user_id = session['id']
        


        

#         sql_qurry = '''
#                 INSERT INTO `wishlist`(`wishlist_id`, `user_id`, `item_id`, `item_type`) VALUES (%s,%s,%s,%s)
#         '''

#         sql_value = (wishlist_id,user_id,item_id,item_type)

#         cursor.execute(sql_qurry,sql_value)
#         connection.commit()

       

        
#     except Exception as e:
#         flash(f"Error is {e}")
       
#     finally:
#         connection.close()
#         cursor.close()



@series_bp.route("/wishlist/<item_type>/<item_id>")
def wishlist(item_type, item_id):

    connection = None
    cursor = None

    try:

        # -------------------------
        # LOGIN CHECK
        # -------------------------
        if "email" not in session:
            flash("Please login first.", "danger")
            return redirect(url_for("auth.login"))

        # -------------------------
        # ITEM TYPE CHECK
        # -------------------------
        if item_type not in ["movie", "series"]:
            return "Invalid item type", 400

        # -------------------------
        # DATABASE CONNECTION
        # -------------------------
        connection = genreted_db_connect()
        cursor = connection.cursor()

        # -------------------------
        # USER ID
        # -------------------------
        user_id = session["id"]

        # -------------------------
        # CHECK ALREADY IN WISHLIST
        # -------------------------
        check_query = """
            SELECT wishlist_id
            FROM wishlist
            WHERE user_id = %s
            AND item_id = %s
            AND item_type = %s
            LIMIT 1
        """

        cursor.execute(
            check_query,
            (user_id, item_id, item_type)
        )

        existing = cursor.fetchone()

        # -------------------------
        # ADD TO WISHLIST
        # -------------------------
        if existing:

            flash("Already added to wishlist.", "info")

        else:

            wishlist_id = genreted_uid(13)

            sql_query = """
                INSERT INTO wishlist
                (
                    wishlist_id,
                    user_id,
                    item_id,
                    item_type
                )
                VALUES (%s, %s, %s, %s)
            """

            sql_value = (
                wishlist_id,
                user_id,
                item_id,
                item_type
            )

            cursor.execute(sql_query, sql_value)

            connection.commit()

            flash("Added to wishlist ❤️", "success")

        # -------------------------
        # IMPORTANT RETURN
        # -------------------------
        return redirect(request.referrer or url_for("series.series"))

    except Exception as e:

        if connection:
            connection.rollback()

        flash(f"Error is: {e}", "danger")

        return redirect(request.referrer or url_for("series.series"))

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
