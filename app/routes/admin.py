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
@admin_bp.route('/Categories',methods=['GET','POST'])
def Categories():
        if 'admin_email' not in session:
            return redirect(url_for('auth.login'))
        
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
            
            if not Cname:
                flash('Category name is required.', 'danger')
                return redirect(url_for('admin.show_category'))

            connction = genreted_db_connect()
            cursour = connction.cursor(dictionary=True)

            if not connction.is_connected():
                cursour.close()
                connction.close()
                flash('Database connection failed.', 'danger')
                return redirect(url_for('admin.show_category'))

            cursour.execute("SELECT * FROM `category` WHERE category_name = %s", (Cname,))
            categories = cursour.fetchone()

            if categories:
                cursour.close()
                connction.close()
                flash('Category already exists.', 'warning')
                return redirect(url_for('admin.show_category'))

            uploaded_file = None
            if Cfile and Cfile.filename:
                filename = secure_filename(Cfile.filename)
                if filename:
                    os.makedirs(FILE_PATH, exist_ok=True)
                    save_path = os.path.join(FILE_PATH, filename)
                    Cfile.save(save_path)
                    uploaded_file = filename

            Cqurey = '''INSERT INTO `category`(`category_name`, `slug`, `category_description`, `category_type`, `category_display`, `tems`, `category_status`, `category_Icon`, `category_thumbnail`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
            Cvalue = (Cname, Cslug, Cdescription, Ctype, Cdisplay, Citems, Cstatus, Cicon, uploaded_file)
            cursour.execute(Cqurey, Cvalue)
            connction.commit()
            cursour.close()
            connction.close()

            flash('Category saved successfully.', 'success')
            return redirect(url_for('admin.show_category'))

        
@admin_bp.route('/show_category')
def show_category():
    return render_template('category.html',active_page = 'category')