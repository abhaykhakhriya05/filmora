from flask import Blueprint , session , Response , render_template , request , url_for , redirect
from app import genreted_db_connect

admin_bp = Blueprint('admin',__name__)

@admin_bp.route('/dashboard')
def dashboard():
    
    render_template('admin_dashboard.html')