from flask import Flask
import mysql.connector as db


def genreted_db_connect():
    
     return db.connect(
            host = 'localhost',
            username = 'root',
            password = '',
            database = 'filmora'
        )
    

        

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