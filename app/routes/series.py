from flask import Blueprint,render_template,redirect,url_for,Response,flash
from app import genreted_db_connect,genreted_uid

series_bp = Blueprint("series",__name__)

@series_bp.route('/series')
def series():
    connection = None
    cursor = None
    try:
        connection = genreted_db_connect()
        cursor = connection.cursor(dictionary=True)

        # Fetch series data from the database
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
        
    except Exception as e:
        print(f"Error fetching series data: {e}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    return render_template('series.html', active_page='series', series_data=series_data, upcoming_series_data=upcoming_series_data, most_reviewed_series_data=most_reviewed_series_data,  poster_series_data=poster_series_data, anime_series_data=anime_series_data)