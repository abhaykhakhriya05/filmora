from flask import Flask , request,url_for,redirect,session,Response , render_template

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Replace with your own secret key



@app.route('/')
def home():
    return render_template("index.html",active_page='home')

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/signup')
def signup():
    return render_template("register.html")

@app.route('/movies')
def movies():
    return render_template("movie.html",active_page='movies')

@app.route('/series')
def series():
    return render_template("series.html",active_page='series')

@app.route('/subscription')
def subscription():
    return render_template("subscription.html",active_page='subscription')

@app.route('/faq')
def faq():
    return render_template("faq.html")

if __name__ == '__main__':
    app.run(debug=True)



