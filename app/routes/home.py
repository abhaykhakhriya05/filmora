from flask import Blueprint , redirect , render_template , request ,Response,url_for,session
from app import genreted_db_connect
from mysql.connector import Error

home_bp = Blueprint('home',__name__)


@home_bp.route('/')
def index():
    
    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)
    
    if connction.is_connected():
        try:
            cursor.execute("SELECT * FROM `category`")
            cate = cursor.fetchall()
            
            cursor.execute("SELECT * FROM `movies` ")
            movies = cursor.fetchall()
        except Error as e:
            return f'''<h1 color="red">{e}</h1>'''
        finally:
            connction.close()
            cursor.close()
    
    
    return render_template('index.html',active_page = 'home',cate = cate,movies = movies)


   