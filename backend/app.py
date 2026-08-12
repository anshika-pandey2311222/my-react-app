from flask import Flask, request, jsonify
from flask_cors import CORS
from chat_api import chat_bp
from dotenv import load_dotenv
import requests
import os

# Load environment variables from .env file if present
load_dotenv()

app = Flask(__name__)

# Proper CORS for Render & local dev
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(chat_bp)

# ---------------- ROOT ----------------
@app.route("/", methods=["GET"])
def home():
    return "AlgoMate Backend Running 🚀", 200

# ---------------- HEALTH ----------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

# ---------------- COMPILER ----------------
@app.route("/compile", methods=["POST"])
def compile_code():
    data = request.get_json()

    if not os.getenv("JUDGE0_API_KEY"):
        return jsonify({"error": "JUDGE0_API_KEY not set"}), 500

    url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true"

    headers = {
        "content-type": "application/json",
        "X-RapidAPI-Key": os.getenv("JUDGE0_API_KEY"),
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
    }

    payload = {
        "language_id": data.get("language_id"),
        "source_code": data.get("source_code"),
        "stdin": data.get("stdin", "")
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
