from flask import Blueprint , redirect , render_template , request ,Response,url_for,session
from app import genreted_db_connect

home_bp = Blueprint('home',__name__)


@home_bp.route('/')
def index():
    
    
    return render_template('index.html',active_page = 'home')


   