from flask import Blueprint , redirect , render_template , request ,Response,url_for,session
from app import genreted_db_connect

admin_bp = Blueprint('admin',__name__)

@admin_bp.route('/dashboard')
def dashboard():
    if 'admin_email' not in session:
        return redirect(url_for('auth.login'))

    return render_template('admin_dashboard.html',active_page = 'dashboard')


@admin_bp.route('/Categories')
def Categories():
        if 'admin_email' not in session:
            return redirect(url_for('auth.login'))
    
        return render_template('category.html',active_page = 'category')