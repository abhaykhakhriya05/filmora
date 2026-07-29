from flask import Blueprint , redirect , render_template , request ,Response,url_for,session, flash
from app import genreted_db_connect , genreted_uid
from mysql.connector import Error
from werkzeug.utils import  secure_filename
import os

admin_bp = Blueprint('admin',__name__)

# store a save file path in the application static folder
APP_ROOT = os.path.dirname(admin_bp.root_path)
VIDEO_FILE = os.path.join(APP_ROOT,'static', 'video')
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
    
    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)
    
    if connction.is_connected():
        cursor.execute("SELECT * FROM category")
        cat = cursor.fetchall()
        
        connction.close()
        cursor.close()
    
    return render_template('category.html',active_page = 'category', cat = cat)
    
        
 
# create category 
@admin_bp.route('/send_category',methods=['GET','POST'])
def send_category():
    
    if request.method == 'POST':
        # input user
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
           
            # conncetion object   
         connction = genreted_db_connect()
         cursor = connction.cursor()
         
            # database connction  
         if not connction.is_connected():
            cursor.close()
            connction.close()
            flash('Database connection failed.', 'danger')
            return redirect(url_for('admin.Categories'))
         
        #  fetch file categories name to database
         cursor.execute("SELECT * FROM `category` WHERE category_name = %s", (Cname,))
         categories = cursor.fetchone()

         if categories:
            cursor.close()
            connction.close()
            flash('Category already exists.', 'warning')
            return redirect(url_for('admin.Categories'))
        
        # save a file server
         uploaded_file = None
         if Cfile and Cfile.filename:
                filename = secure_filename(Cfile.filename)
                if filename:
                    os.makedirs(FILE_PATH, exist_ok=True)
                    save_path = os.path.join(FILE_PATH, filename)
                    Cfile.save(save_path)
                    uploaded_file = filename


            #  data insert to category database
         Cqurey = '''INSERT INTO `category`(`category_name`, `slug`, `category_description`, `category_type`, `category_display`, `tems`, `category_status`, `category_Icon`, `category_thumbnail`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
         Cvalue = (Cname, Cslug, Cdescription, Ctype, Cdisplay, Citems, Cstatus, Cicon, uploaded_file)
         cursor.execute(Cqurey, Cvalue)
         connction.commit()
         cursor.close()
         connction.close()

         flash('Category saved successfully.', 'success')
         return redirect(url_for('admin.Categories'))


# category delete
@admin_bp.route('/delete_category/<int:ct_id>')
def delete_category(ct_id):
    # database connect object
    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)

    try:
        if not connction.is_connected():
            flash('Database connection failed.', 'danger')
            return redirect(url_for('admin.Categories'))

        # fetch data to ct_id
        cursor.execute("SELECT category_thumbnail FROM `category` WHERE c_id = %s", (ct_id,))
        row = cursor.fetchone()

        # remove the file to server
        if row and row.get('category_thumbnail'):
            filename = secure_filename(row['category_thumbnail'])
            file_path = os.path.join(FILE_PATH, filename)
            if os.path.exists(file_path):
                os.remove(file_path)

        # database delete record to catogories table
        cursor.execute("DELETE FROM `category` WHERE c_id = %s", (ct_id,))
        connction.commit()
        flash('Category deleted successfully.', 'success')
    except Exception:
        flash('Error deleting category.', 'danger')
    finally:
        cursor.close()
        connction.close()

    return redirect(url_for('admin.Categories'))


# movie desshborad 

@admin_bp.route('/movie_list')
def movie_list():
    if 'admin_login' not in session:
        return redirect(url_for('auth.login'))
    
    connction = genreted_db_connect()
    cursor = connction.cursor(dictionary=True)
    
    if connction.is_connected():
        cursor.execute("SELECT `category_name` FROM category")
        cate = cursor.fetchall()
        
    
    return render_template('movie_list.html',cate=cate)

@admin_bp.route('/movie_send',methods = ['GET','POST'])
def movie_send():
    
    if request.method == 'POST':
        # insilization input
        movie_id = genreted_uid(10)
        movie_name = request.form.get('movie_name')
        movie_desc = request.form.get('movie_desc')
        movie_access = request.form.get('movie_access')
        movie_language = request.form.get('movie_language')
        movie_cat = request.form.get('movie_cat')
        movie_year = request.form.get('movie_year')
        movie_date = request.form.get('movie_date')
        movie_duration = request.form.get('movie_duration')
        movie_status = request.form.get('movie_status')
        movie_thumb = request.files.get('movie_thumb')
        movie_poster = request.files.get('movie_poster')
        seo_title = request.form.get('seo_title')
        seo_keywords = request.form.get('seo_keywords')
        seo_description = request.form.get('seo_description')
        # input Cast value
        cast_type = request.form.getlist('cast_type[]')
        cast_name = request.form.getlist('cast_name[]')
        cast_role = request.form.getlist('cast_role[]')
        # input movie files
        video_quality = request.form.getlist('video_quality[]')
        video_file = request.files.getlist('video_file[]')
        video_download = request.form.getlist('video_download[]')
        
        
        # connction object
        connction = genreted_db_connect()
        cursor = connction.cursor(dictionary=True)
        try:
            if connction.is_connected():
                cursor.execute("SELECT * FROM `movies` WHERE movie_name = %s",(movie_name,))
                movies = cursor.fetchone()
                
                if movies : 
                    connction.close()
                    cursor.close()
                    flash("Movies Only Exitest")
                else:
                    
                    # thumbmail save server
                    movie_thumb_file = None
                    if movie_thumb and movie_thumb.filename :
                        thumb_filename = secure_filename(movie_thumb.filename)
                        if movie_thumb : 
                            os.makedirs(FILE_PATH,exist_ok=True)
                            thumb_path = os.path.join(FILE_PATH,thumb_filename)
                            movie_thumb.save(thumb_path)
                            movie_thumb_file = thumb_filename
                    
                    # poster save to server
                    movie_poster_file = None
                    if movie_poster and movie_poster.filename :
                        poster_filename = secure_filename(movie_poster.filename)  
                        if movie_poster :
                            os.makedirs(FILE_PATH,exist_ok=True)
                            poster_path = os.path.join(FILE_PATH,poster_filename)
                            movie_poster.save(poster_path)   
                            movie_poster_file = poster_filename
                    
                    # insert into database
                    movies_qurry = '''
                           INSERT INTO movies(movie_id,movie_name,movie_name,movie_language,movie_categories,movie_release_date,movie_release_year,movie_duration,movie_status,movie_thumbnail,movie_poster,seo_title,seo_keywords,seo_description)
                           VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                        ''' 
                        
                    #  insert values
                    movies_values = (movie_id,movie_name,movie_language,movie_cat,movie_date,movie_year,movie_duration,movie_status,movie_thumb_file,movie_poster_file,seo_title,seo_keywords,seo_description)
                    cursor.execute(movies_qurry,movies_values)
                    connction.commit()
                    
                    # insert into cast value cast database
                    
                    cast_qurry = '''
                        INSERT INTO movie_cast(movie_id,movie_cast_id,movie_cast_type,movie_cast_name,movie_cast_role)VALUES(%s,%s,%s,%s,%s)
                    '''
                    
                    
            else:
                connction.close()
                cursor.close()
                flash('Database Not Conncted','danger')
                return redirect(url_for('admin.movie_list'))
            
        except Error as e:
            flash(f'Error Is {e}')
        finally:
            connction.close()
            cursor.close()        
        
            
                
    
    


