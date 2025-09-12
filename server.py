#!/usr/bin/env python3
import http.server
import socketserver
import os
from urllib.parse import urlparse

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add cache control headers to prevent caching issues in development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        # Health endpoint for deployment health checks
        if self.path in ['/api', '/health']:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
            return
            
        # For single-page applications, serve index.html for all non-file requests
        parsed_path = urlparse(self.path)
        file_path = parsed_path.path.lstrip('/')
        
        # If the path doesn't have an extension and doesn't point to an existing file,
        # serve index.html (for SPA routing)
        if not os.path.exists(file_path) and '.' not in os.path.basename(file_path):
            self.path = '/index.html'
        
        super().do_GET()
    
    def do_HEAD(self):
        # Health endpoint for deployment health checks (HEAD requests)
        if self.path in ['/api', '/health']:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            return
            
        super().do_HEAD()

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 5000))
    HOST = "0.0.0.0"
    
    # Change to the directory containing our files
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer((HOST, PORT), MyHTTPRequestHandler) as httpd:
        print(f"Server running at http://{HOST}:{PORT}/")
        httpd.serve_forever()