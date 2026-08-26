from flask import Blueprint , redirect , render_template , request ,Response,url_for,session,flash
from app import genreted_db_connect
from mysql.connector import Error

home_bp = Blueprint('home',__name__)


@home_bp.route('/')
def index():
   
    connction = None
    cursor = None 

    try:
        connction = genreted_db_connect()
        cursor = connction.cursor(dictionary=True)

        cursor.execute("SELECT * FROM category")
        cate = cursor.fetchall()

        cursor.execute("""
            SELECT * FROM movies
            WHERE movie_release_date <= NOW()
            AND Ishomepage = 1
            ORDER BY RAND()
            LIMIT 10
        """)
        movies = cursor.fetchall()

        cursor.execute("""
            SELECT * FROM movies
            WHERE movie_release_date <= NOW()
            AND Ishomepage = 1
            ORDER BY view DESC
            LIMIT 10
        """)
        most_reviewed_movies = cursor.fetchall()

        return render_template(
            'index.html',
            active_page='home',
            cate=cate,
            movies=movies,
            most_reviewed_movies=most_reviewed_movies
        )

    except Exception as e:
        print("HOME ERROR:", e)
        return f"Database error: {e}", 500

    finally:
        if cursor:
            cursor.close()
        if connction:
            connction.close()


# movie view route
@home_bp.route('/movie_view/<movie_id>')
def movie_view(movie_id):

    if 'email' not in session:
        return redirect(url_for("auth.login"))


    movies = None
    cast = []
    movie_file = []
    movie_subtitle = []
    recommended_movies = None
    reco = True

    conncetion = genreted_db_connect()
    cursor = conncetion.cursor(dictionary=True)

    try:

        cursor.execute("SELECT * FROM `movies` WHERE movie_id = %s",(movie_id,))
        movies = cursor.fetchone()
        print(movies)

        cursor.execute("SELECT * FROM `movie_cast` WHERE movie_id = %s",(movie_id,))
        cast = cursor.fetchall()
        print(cast)

        cursor.execute("SELECT * FROM `movie_file` WHERE movie_id = %s",(movie_id,))
        movie_file = cursor.fetchall()
        

        cursor.execute("SELECT * FROM `movie_subtitles` WHERE movie_id = %s",(movie_id,))
        movie_subtitle = cursor.fetchall()

        # cursor.execute("SELECT * FROM `movies` WHERE recommended = TRUE AND movie_id != %s",(movie_id,))
        # recommended_movies = cursor.fetchall()

        conncetion.commit()
    except Exception as e:
        flash(f"Error {e}")
    finally:
        cursor.close()
        conncetion.close()

    return render_template("movie_view.html",movies = movies,cast = cast,movie_file = movie_file , movie_subtitle = movie_subtitle, active_page = 'movie' , recommended_movies = recommended_movies)


