import io

import app.routes.admin as admin_routes
from app import create_app


class FakeCursor:
    def __init__(self):
        self.executed_queries = []

    def execute(self, query, params=None):
        self.executed_queries.append((query, params))
        return None

    def fetchone(self):
        return None

    def close(self):
        return None


class FakeConnection:
    def __init__(self):
        self.cursor_obj = FakeCursor()
        self.commits = 0
        self.closed = False

    def cursor(self, dictionary=True):
        return self.cursor_obj

    def is_connected(self):
        return True

    def commit(self):
        self.commits += 1

    def rollback(self):
        return None

    def close(self):
        self.closed = True


def test_movie_send_inserts_movie_data_and_redirects(monkeypatch):
    app = create_app()
    fake_connection = FakeConnection()

    monkeypatch.setattr(admin_routes, 'genreted_db_connect', lambda: fake_connection)
    monkeypatch.setattr(admin_routes, 'genreted_uid', lambda size: 'A' * size)

    client = app.test_client()

    with client.session_transaction() as session:
        session['admin_login'] = 'admin@example.com'

    response = client.post(
        '/movie_send',
        data={
            'movie_name': 'Example Movie',
            'movie_desc': 'A test movie',
            'movie_access': 'free',
            'movie_language': 'English',
            'movie_cat': 'Action',
            'movie_year': '2024',
            'movie_date': '2024-01-01',
            'movie_duration': '120',
            'movie_status': 'active',
            'seo_title': 'Example Movie',
            'seo_keywords': 'movie,test',
            'seo_description': 'Example movie description',
            'cast_type[]': ['Actor'],
            'cast_name[]': ['Jane Doe'],
            'cast_role[]': ['Lead'],
            'video_quality[]': ['1080p'],
            'video_download[]': ['Enabled'],
            'subtitle_lang[]': ['English'],
        },
        content_type='multipart/form-data',
        follow_redirects=False,
    )

    assert response.status_code == 302
    assert fake_connection.commits >= 1
    assert any('INSERT INTO movies' in query for query, _ in fake_connection.cursor_obj.executed_queries)
    assert any('INSERT INTO movie_subtitles' in query for query, _ in fake_connection.cursor_obj.executed_queries)
