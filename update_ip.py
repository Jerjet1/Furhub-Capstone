import socket
import os


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Doesn't need to actually connect, just used to get the right interface
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip

local_ip = get_local_ip()

public_url = f'http://{local_ip}:8000/'

frontend_env = os.path.join("FurhubWeb", ".env")
mobile_env = os.path.join("FurhubMobile", ".env")

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
            if line.startswith("API_URL"):
                lines[i] = f"API_URL={public_url}"
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

update_env_file(frontend_env, is_frontend=True)
update_env_file(mobile_env, is_frontend=False)