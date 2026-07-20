#!/usr/bin/env python3
"""Serve the project and open the login page in the browser."""
import http.server
import threading
import webbrowser

PORT = 8000


def open_login():
    webbrowser.open(f"http://localhost:{PORT}/login.html")


if __name__ == "__main__":
    httpd = http.server.ThreadingHTTPServer(("", PORT), http.server.SimpleHTTPRequestHandler)
    threading.Timer(0.5, open_login).start()
    print(f"Serving Field Education Program at http://localhost:{PORT}/login.html")
    print("  Demo accounts (password matches username): admin, coordinator, student")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
