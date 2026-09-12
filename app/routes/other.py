from flask import Blueprint , render_template , request , redirect , url_for , session ,Response,flash
from app import genreted_db_connect

other_bp = Blueprint('other',__name__)


@other_bp.route("/privacy")
def privacy():
    return render_template("privacy_policy.html")

@other_bp.route("/contact_us")
def contact_us():
    return render_template("contact_us.html")

@other_bp.route("/faq")
def faq():
    return render_template("faq.html")