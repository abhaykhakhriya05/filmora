from flask import Flask , request,url_for,redirect,session,Response , render_template

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Replace with your own secret key



@app.route('/')
def home():
    return render_template("index.html", active_page='home')

@app.route('/show-series')
def show_series():
    return render_template("show_series.html", active_page='show_series')

@app.route('/seasons')
def seasons():
    return render_template("Seasons.html", active_page='seasons')

@app.route('/episodes')
def episodes():
    return render_template("Episodes.html", active_page='episodes')

@app.route('/category')
def category():
    return render_template("category.html", active_page='category')

@app.route('/movie-list')
def movie_list():
    return render_template("movie_list.html", active_page='movie_list')

@app.route('/dashboard')
def dashboard():
    return render_template("admin_dashboard.html", active_page='dashboard')

@app.route('/users')
def users():
    return render_template("users.html", active_page='users')

@app.route('/comments')
def comments():
    return render_template("comment.html", active_page='comments')

@app.route('/ratings')
def ratings():
    return render_template("rating.html", active_page='ratings')

@app.route('/admin-setting')
def admin_setting():
    return render_template("admin_setting.html", active_page='admin_setting')

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

@app.route('/privacy-policy')
def privacy_policy():
    return render_template("privacy_policy.html")

@app.route('/contact-us')
def contact_us():
    return render_template("contact_us.html")

if __name__ == '__main__':
    app.run(debug=True)



