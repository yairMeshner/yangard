import subprocess
import sys
import shutil
import os

PROD_URL = "https://yangard-api.azurewebsites.net"
DEV_URL = "http://127.0.0.1:8000"

prod = "--prod" in sys.argv
server_url = PROD_URL if prod else DEV_URL

print(f"Building keyspy exe with SERVER={server_url}")

# Write a temporary config file that gets bundled into the exe
config_path = os.path.join("keyspy", "src", "_build_config.py")
with open(config_path, "w") as f:
    f.write(f'SERVER_URL = "{server_url}"\n')

try:
    subprocess.run([
        "pyinstaller",
        "--onefile",
        "--noconsole",
        "--name", "keyspy",
        "keyspy/src/keyspy_client.py"
    ], check=True)

    shutil.copy("dist/keyspy.exe", "keyspy/keyspy.exe")
    print(f"\nDone. keyspy/keyspy.exe built with SERVER={server_url}")
finally:
    os.remove(config_path)
