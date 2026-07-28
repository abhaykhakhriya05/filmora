from flask import Flask
import mysql.connector as db
import random
import string
import os

def genreted_uid(size):
    
    char = string.ascii_uppercase + string.digits
    rendom_list = random.choice(char, k = size)
    rendom_uid = "".join(rendom_list)
    
    return rendom_uid


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
    


    from app.routes.auth import auth_bp
    from app.routes.home import home_bp
    from app.routes.admin import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(admin_bp)

    return app