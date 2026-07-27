from flask import Blueprint , redirect , render_template , request ,Response,url_for,session, flash
from app import genreted_db_connect
from werkzeug.utils import  secure_filename
import os

admin_bp = Blueprint('admin',__name__)

# store a save file path in the application static folder
APP_ROOT = os.path.dirname(admin_bp.root_path)
FILE_PATH = os.path.join(APP_ROOT, 'static', 'image')
os.makedirs(FILE_PATH, exist_ok=True)

@admin_bp.route('/dashboard')
def dashboard():
    if 'admin_email' not in session:
        return redirect(url_for('auth.login'))

    return render_template('admin_dashboard.html',active_page = 'dashboard')

# Categories page
@admin_bp.route('/Categories')
def Categories():
    
    if 'admin_login' not in session :
        return redirect(url_for('auth.login'))
    
    return render_template('category.html',active_page = 'category')
    
        
        
@admin_bp.route('/send_category',methods=['GET','POST'])
def send_category():
    
    if request.method == 'POST':
        
         Cname = request.form.get('Cname', '').strip()
         Cslug = request.form.get('Cslug', '').strip()
         Cdescription = request.form.get('Cdescription', '').strip()
         Ctype = request.form.get('Ctype', '')
         Cdisplay = request.form.get('Cdisplay', '')
         Citems = request.form.get('Citems', '')
         Cstatus = request.form.get('Cstatus', '')
         Cicon = request.form.get('Cicon', '')
         Cfile = request.files.get('Cfile')
         
         if not Cname :
             flash("Image File Is reqvried")
             return(redirect(url_for('admin.Categories')))
         
         connction = genreted_db_connect()
         cursor = connction.cursor()
         
         if connction.is_connected():
             
             cursor.execute("SELECT * FROM WHERE category_name = ")
    