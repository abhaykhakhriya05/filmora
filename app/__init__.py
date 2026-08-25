from flask import Flask
import random
import string
import os
import mysql.connector as db

def genreted_db_connect():
    return db.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='',
        database='filmora',
        connection_timeout=5,
        use_pure=True
    )

def genreted_uid(size):
    
    pool = string.ascii_uppercase + string.digits
    random_code = ''.join(random.choices(pool, k=size))
    
    return random_code



# if genereted_db_connect():
#     print("susscfully")
# else:
#     print("not")




    
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