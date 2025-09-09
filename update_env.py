# update_env.py
import requests
import re
import os

# Get active tunnels from ngrok API (default port: 4040)
NGROK_API_URL = "http://127.0.0.1:4040/api/tunnels"

try:
    response = requests.get(NGROK_API_URL).json()
    # pick https tunnel
    public_url = next(t["public_url"] for t in response["tunnels"] if t["public_url"].startswith("https"))

    # Ensure trailing slash
    if not public_url.endswith("/"):
        public_url += "/"

    # Paths to .env files
    frontend_env = os.path.join("FurhubWeb", ".env")
    mobile_env = os.path.join("FurhubMobile", ".env")

    # update function
    def update_env_file(path):
        lines = []
        if os.path.exists(path):
            with open(path, "r") as f:
                lines = f.readlines()

        updated = False
        for i, line in enumerate(lines):
            if line.startswith("API_URL="):
                lines[i] = f"API_URL={public_url}\n"
                updated = True
                break

        if not updated:
            lines.append(f"API_URL={public_url}\n")

        with open(path, "w") as f:
            f.writelines(lines)

        print(f"✅ Updated {path} with API_URL={public_url}")

    # Update both .env files
    update_env_file(frontend_env)
    update_env_file(mobile_env)

except Exception as e:
    print("❌ Failed to update .env:", e)
