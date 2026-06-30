#!/usr/bin/env python3
"""Serve the project and open the student and staff dashboards in the browser."""
import http.server
import threading
import webbrowser

PORT = 8000


def open_dashboards():
    webbrowser.open(f"http://localhost:{PORT}/index.html")
    webbrowser.open(f"http://localhost:{PORT}/staff-dashboard.html")


if __name__ == "__main__":
    httpd = http.server.ThreadingHTTPServer(("", PORT), http.server.SimpleHTTPRequestHandler)
    threading.Timer(0.5, open_dashboards).start()
    print(f"Serving Field Education Program dashboards at http://localhost:{PORT}")
    print("  Student dashboard:     http://localhost:%d/index.html" % PORT)
    print("  Coordinator dashboard: http://localhost:%d/staff-dashboard.html" % PORT)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
