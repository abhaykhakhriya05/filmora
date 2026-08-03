from flask import Flask
import mysql.connector as db
import random
import string
import os

def genreted_uid(size):
    
    pool = string.ascii_uppercase + string.digits
    random_code = ''.join(random.choices(pool, k=size))
    
    return random_code




def genreted_db_connect():
    
     return db.connect(
            host = 'localhost',
            username = 'root',
            password = '',
            database = 'filmora'
        )
    
UPLODE_FOLDER = ('static','image')


def create_app():

    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your-secret-key'
    # Allow large uploads (adjust size as needed, e.g. 5GB)
    app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 * 1024  # 5 GB
    


    from app.routes.auth import auth_bp
    from app.routes.home import home_bp
    from app.routes.admin import admin_bp
    from app.routes.movie import movie_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(movie_bp)

    return app