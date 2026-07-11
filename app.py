from flask import Flask , request,url_for,redirect,session,Response

app = Flask(__name__)
app.secret_key = 	

# login page
@app.route('/',methods=["GET","POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if username == "Abhay" and password == "1504":
            session["user"] = username #sore user name
            return redirect(url_for("welcome"))
        else:
            return Response("In-valid content. Try again", mimetype="text/plain") #text/HTML
        
    return'''

            <h2> Login Page </h2>
            <form method="POST">
            Username: <input type="text" name="username"><br>
            Password:<input type="password" name="password"><br>
            <input type="submit" value="Login">
            </form>

'''

# welcome page

@app.route("/welcome")
def welcome():
    if "user" in session:
        return f'''
        <h2> Welcome , {session["user"]}</h2>
        <a href={url_for('logout')}>Logout</a>
    '''
    return redirect(url_for("login"))

# logout

@app.route("/logout")
def logout():
    session.pop("user",None)
    return redirect(url_for("login"))