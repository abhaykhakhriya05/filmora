from flask import Blueprint , redirect , render_template , url_for , flash
import razorpay
from app import genreted_db_connect,genreted_uid

subscription_bp = Blueprint('subscription',__name__)

@subscription_bp.route("/subscription")
def subscription():

    connection = genreted_db_connect()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute("SELECT * FROM `subscription_plans`")
        subscription_plans = cursor.fetchall()

        print(subscription_plans)
    except Exception as e :
        flash(f"Error {e}")
        redirect(url_for("subscription.subscription"))
    finally:
        connection.close()
        cursor.close()
    return render_template("subscription.html",active_page = 'subscription', subscription_plans =subscription_plans)


