from flask import Blueprint , render_template , request , redirect , url_for , session ,Response
from app import genreted_db_connect
from werkzeug.security import generate_password_hash , check_password_hash

auth_bp = Blueprint('auth',__name__)


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
                return redirect(url_for('admin.dashboard'))
               
            
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
                    session['loggedin'] = True
                    session['subscribed'] = user['subscribed']

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
    return redirect(url_for('home.index'))


@auth_bp.route("/register", methods=['GET','POST'])
def register():
    if request.method == 'POST' :
        firstName = request.form.get('firstName')
        lastName = request.form.get('lastName')
        email = request.form.get('email')
        password = request.form.get('password')
        hash_password = generate_password_hash(password)

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

                return redirect(url_for('auth.login'))
    return render_template('register.html')



@auth_bp.route('/profile/<int:user_id>')
def profile(user_id):
    
    if 'email' not in session :
        return redirect(url_for('auth.login'))
    
    return render_template('profile.html')


@auth_bp.route('/setting')
def setting():
    
    return render_template('setting.html')
        
            
            


