from pathlib import Path
from flask import Flask, send_from_directory

ROOT = Path(__file__).parent
WEB = ROOT / "web"
app = Flask(__name__, static_folder=str(WEB), static_url_path="")

@app.get("/")
def index():
    return send_from_directory(WEB, "index.html")

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    # Local-only by default. Open http://127.0.0.1:5000 on this phone.
    app.run(host="127.0.0.1", port=5000, debug=False)
