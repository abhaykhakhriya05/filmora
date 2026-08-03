from flask import Blueprint , render_template , redirect , request , url_for ,flash
from app import genreted_db_connect 

movie_bp = Blueprint('movie',__name__)

@movie_bp.route('/movie')
def movie():

    try:

        conn = genreted_db_connect()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM movies WHERE movie_release_date <= NOW() ORDER BY movie_release_date DESC LIMIT 10")
        movies = cursor.fetchall()

        cursor.execute("SELECT * FROM movies WHERE movie_release_date > NOW() ORDER BY movie_release_date ASC LIMIT 10")
        upcoming_movies = cursor.fetchall()

        cursor.execute("SELECT * FROM `movies` WHERE movie_release_date <= NOW() ORDER BY review DESC LIMIT 10")
        most_reviewed_movies = cursor.fetchall()
        
    except Exception as e:
        flash(f"Error: {str(e)}", "danger")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    return render_template('movie.html', active_page='movie', movies=movies, upcoming_movies=upcoming_movies, most_reviewed_movies=most_reviewed_movies)