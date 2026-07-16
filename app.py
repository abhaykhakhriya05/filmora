from flask import Flask , request,url_for,redirect,session,Response , render_template

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Replace with your own secret key


@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template("login.html")

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/movies')
def movies():
    return render_template("movie.html")

@app.route('/series')
def series():
    return render_template("series.html")

@app.route('/subscription')
def subscription():
    return render_template("subscription.html")

@app.route('/faq')
def faq():
    return render_template("faq.html")

if __name__ == '__main__':
    app.run(debug=True)



