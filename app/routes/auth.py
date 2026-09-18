import os

from flask import Blueprint , render_template , request , redirect , url_for , session ,Response,flash
from app import genreted_db_connect , genreted_uid
from werkzeug.security import generate_password_hash , check_password_hash
from werkzeug.utils import secure_filename

auth_bp = Blueprint('auth',__name__)

PROFILE_IMAGE_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'image')
ALLOWED_PROFILE_IMAGES = {'jpg', 'jpeg', 'png', 'webp'}
PHONE_COUNTRY_CODES = (
    ('91', 'India (+91)'),
    ('1', 'United States (+1)'),
    ('44', 'United Kingdom (+44)'),
    ('61', 'Australia (+61)'),
    ('81', 'Japan (+81)'),
    ('86', 'China (+86)'),
    ('971', 'United Arab Emirates (+971)'),
)


@auth_bp.route("/login", methods=['GET','POST'])
def login():
    
    if request.method == 'POST':
        
        email = request.form.get('email')
        password = request.form.get('password')
        

        connection = genreted_db_connect()
        cursor = connection.cursor(dictionary=True)
        
        

        if connection.is_connected:
            
            cursor.execute("SELECT * FROM `admin_dashboard` WHERE email =  %s",(email,))
            admin_user = cursor.fetchone()
            
            
            
            if admin_user and password == admin_user['password'] :
                session["admin_email"] = admin_user['email']
                session["admin_id"] = admin_user['admin_id']
                session['admin_login'] = True
                flash('Admin Login Successfully.', 'success')
                return redirect(url_for('admin.movie_list'))
               
            
            else : 
                cursor.execute("SELECT * FROM `users` WHERE email =  %s",(email,))
                user = cursor.fetchone()


                cursor.close()
                connection.close()


                if user and check_password_hash(user['password'],password) :
                    session['id'] = user['id'] 
                    session['firstName'] = user['firstName']
                    session['lastName'] = user['lastName']
                    session['email'] = user['email']
                    session['username'] = user.get('username', '')
                    session['phone_number'] = user.get('phone_number', '')
                    session['dp'] = user.get('profile_image')
                    session['loggedin'] = True
                    session['subscribed'] = user['subscribed']
                    session['email_verified'] = user['email_verified']
                    print(session['email_verified'])
                    flash('Login Successfully.', 'success')

                    return redirect(url_for('home.index'))
                else : 
                    return "in vaild email,password"
            
        else :
            return 'not connect'
    return render_template('login.html')


@auth_bp.route("/logout")
def logout():
    session.clear()
    session['loggedin'] = False
    flash('Logout Successfully Please Login.', 'success')
    return redirect(url_for('home.index'))


@auth_bp.route("/register", methods=['GET','POST'])
def register():
    if request.method == 'POST' :
        firstName = request.form.get('firstName')
        lastName = request.form.get('lastName')
        email = request.form.get('email')
        password = request.form.get('password')
        hash_password = generate_password_hash(password)
        id = genreted_uid(11)

        connction = genreted_db_connect()
        cursour = connction.cursor()

        if connction.is_connected():
            cursour.execute('SELECT * FROM users WHERE email = %s', (email,))
            accounts = cursour.fetchone()

            if accounts :
                connction.close()
                cursour.close()
                return redirect(url_for('auth.login'))
            else:
                insert_qurey = '''
                    INSERT INTO users(firstName,lastName,email,password)VALUES(%s,%s,%s,%s)
                '''

                insert_values = (firstName,lastName,email,hash_password)

                cursour.execute(insert_qurey,insert_values)
                connction.commit()

                cursour.close()
                connction.close()

                flash('Create Account Successfully.', 'success')
                return redirect(url_for('auth.login'))
                
    return render_template('register.html')



@auth_bp.route('/profile/<int:user_id>')
def profile(user_id):


    if "email" not in session:
        return redirect(url_for("auth.login"))

    connection = genreted_db_connect()
    cursor = connection.cursor(dictionary=True)

    

    query = """
        SELECT
            wishlist.wishlist_id,
            wishlist.item_id,
            wishlist.item_type,
            wishlist.created_at,

            CASE
                WHEN wishlist.item_type = 'movie'
                THEN movies.movie_name

                WHEN wishlist.item_type = 'series'
                THEN series.series_name
            END AS title,

            CASE
                WHEN wishlist.item_type = 'movie'
                THEN movies.movie_categories
            
                WHEN wishlist.item_type = 'series'
                THEN series.series_category
            END AS categories,

            CASE
                WHEN wishlist.item_type = 'movie'
                THEN movies.movie_thumbnail

                WHEN wishlist.item_type = 'series'
                THEN series.series_thumbnail
            END AS poster

        FROM wishlist

        LEFT JOIN movies
            ON wishlist.item_type = 'movie'
            AND wishlist.item_id = movies.movie_id

        LEFT JOIN series
            ON wishlist.item_type = 'series'
            AND wishlist.item_id = series.series_id

        WHERE wishlist.user_id = %s

        ORDER BY wishlist.created_at DESC
    """

    cursor.execute(query, (user_id,))

    wishlist = cursor.fetchall()

    cursor.close()
    connection.close()

    return render_template(
        "profile.html",
        wishlist=wishlist
    )


    
    
@auth_bp.route('/profile/edit', methods=['GET', 'POST'])
def edit_profile():
    if 'id' not in session:
        return redirect(url_for('auth.login'))

    connection = genreted_db_connect()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute('SELECT * FROM users WHERE id = %s', (session['id'],))
        user = cursor.fetchone()
        if not user:
            session.clear()
            return redirect(url_for('auth.login'))

        if request.method == 'POST':
            first_name = request.form.get('firstName', '').strip()
            last_name = request.form.get('lastName', '').strip()
            username = request.form.get('username', '').strip()
            email = request.form.get('email', '').strip()
            phone_country_code = request.form.get('phone_country_code', '91').strip()
            phone_local_number = request.form.get('phone_number', '').strip()
            image = request.files.get('profile_image')

            if not first_name or not last_name or not username or not email:
                flash('Name, username, and email are required.', 'warning')
                return redirect(url_for('auth.edit_profile'))

            valid_country_codes = {code for code, _ in PHONE_COUNTRY_CODES}
            if phone_country_code not in valid_country_codes:
                phone_country_code = '91'
            phone_number = f'+{phone_country_code} {phone_local_number}' if phone_local_number else ''

            cursor.execute('SELECT id FROM users WHERE (email = %s OR username = %s) AND id != %s', (email, username, session['id']))
            if cursor.fetchone():
                flash('That email or username is already in use.', 'warning')
                return redirect(url_for('auth.edit_profile'))

            profile_image = user.get('profile_image')
            if image and image.filename:
                extension = image.filename.rsplit('.', 1)[-1].lower() if '.' in image.filename else ''
                if extension not in ALLOWED_PROFILE_IMAGES:
                    flash('Profile image must be JPG, PNG, or WEBP.', 'warning')
                    return redirect(url_for('auth.edit_profile'))
                profile_image = f"profile_{session['id']}.{extension}"
                os.makedirs(PROFILE_IMAGE_FOLDER, exist_ok=True)
                image.save(os.path.join(PROFILE_IMAGE_FOLDER, secure_filename(profile_image)))

            cursor.execute('''
                UPDATE users
                SET firstName = %s, lastName = %s, email = %s, username = %s,
                    phone_number = %s, profile_image = %s
                WHERE id = %s
            ''', (first_name, last_name, email, username, phone_number, profile_image, session['id']))
            connection.commit()
            session.update(firstName=first_name, lastName=last_name, email=email, username=username, phone_number=phone_number, dp=profile_image)
            flash('Profile updated successfully.', 'success')
            return redirect(url_for('auth.profile', user_id=session['id']))

        saved_phone = (user.get('phone_number') or '').strip()
        phone_country_code = '91'
        phone_local_number = saved_phone
        for country_code, _ in PHONE_COUNTRY_CODES:
            prefix = f'+{country_code}'
            if saved_phone.startswith(prefix):
                phone_country_code = country_code
                phone_local_number = saved_phone[len(prefix):].strip()
                break

        return render_template(
            'profile_edit.html',
            user=user,
            phone_country_codes=PHONE_COUNTRY_CODES,
            phone_country_code=phone_country_code,
            phone_local_number=phone_local_number,
            active_page='home',
        )
    finally:
        cursor.close()
        connection.close()


@auth_bp.route('/setting')
def setting():
    
    return render_template('setting.html')




        
            
            


