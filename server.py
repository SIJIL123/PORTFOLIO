import http.server
import socketserver
import webbrowser
import os
import sys

# Define port
PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve the directory containing this script
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    # Force socket reuse so restarting doesn't block the port
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", PORT), PortfolioHandler) as httpd:
            print(f"==================================================")
            print(f"  SIJIL N VARGHESE - LOCAL ARCHITECTURE CORE")
            print(f"  Serving at: http://localhost:{PORT}")
            print(f"  Press CTRL+C to terminate the socket server")
            print(f"==================================================")
            
            # Automatically launch default web browser
            webbrowser.open(f"http://localhost:{PORT}")
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[SYSTEM] Socket connection terminated. Exiting.")
        sys.exit(0)
    except Exception as e:
        print(f"\n[ERROR] Failed to start core host: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
