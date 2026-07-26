from app import create_app


def test_admin_category_post_without_file_does_not_crash():
    app = create_app()
    client = app.test_client()

    with client.session_transaction() as session:
        session['admin_email'] = 'admin@example.com'

    response = client.post(
        '/Categories',
        data={
            'Cname': 'Action',
            'Cslug': 'action',
            'Cdescription': 'Test category',
            'Ctype': 'Movies',
            'Cdisplay': '1',
            'Citems': '0',
            'Cstatus': 'active',
            'Cicon': 'fa-bolt',
        },
    )

    assert response.status_code == 200
