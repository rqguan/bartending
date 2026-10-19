"""Serve at the real GitHub Pages project prefix, without third-party packages."""
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
class Handler(SimpleHTTPRequestHandler):
    def prepare_path(self):
        path = urlsplit(self.path).path
        if path == '/':
            self.send_response(302)
            self.send_header('Location', '/bartending/')
            self.end_headers()
            return False
        if not path.startswith('/bartending/'):
            self.send_error(404)
            return False
        self.path = self.path[len('/bartending'):]
        return True

    def do_GET(self):
        if self.prepare_path():
            super().do_GET()

    def do_HEAD(self):
        if self.prepare_path():
            super().do_HEAD()

print('Local: http://127.0.0.1:8765/bartending/', flush=True)
ThreadingHTTPServer(('127.0.0.1', 8765), partial(Handler, directory=str(ROOT))).serve_forever()
