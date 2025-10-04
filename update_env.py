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
    def update_env_file(path, is_frontend=False):
        lines = []
        if os.path.exists(path):
            with open(path, "r") as f:
                lines = f.readlines()

        updated = False
        for i, line in enumerate(lines):
            if is_frontend:
                if line.startswith("VITE_API_URL"):
                    lines[i] = f"VITE_API_URL={public_url}"
                    updated = True
                    break
            else:
                if line.startswith("API_URL="):
                    lines[i] = f"API_URL={public_url}\n"
                    updated = True
                    break

        if not updated:
            if is_frontend:
                lines.append(f"VITE_API_URL={public_url}\n")
            else:
                lines.append(f"API_URL={public_url}\n")

        with open(path, "w") as f:
            f.writelines(lines)

        key = "VITE_API_URL" if is_frontend else "API_URL"
        print(f"✅ Updated {path} with {key}={public_url}")

    # Update both .env files
    update_env_file(frontend_env, is_frontend=True)
    update_env_file(mobile_env, is_frontend=False)

except Exception as e:
    print("❌ Failed to update .env:", e)
