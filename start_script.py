import os
import subprocess
import logging
from pathlib import Path

### RUN THIS CODE TO START THE APP ###
def start_backend():
    backend_path = Path("backend")
    print("Starting backend server...")
    backend_process = subprocess.Popen(['uvicorn', 'main:app', '--host', '0.0.0.0'], cwd=backend_path)
    
    return backend_process

def start_frontend():
    frontend_path = Path("./frontend")
    print("Starting frontend server...")

    if not os.path.exists(frontend_path / "node_modules"):
        subprocess.run(["npm", "ci"], cwd=frontend_path)

    frontend_process = subprocess.Popen(['ng', 'serve', '--host', '0.0.0.0'], cwd=frontend_path)
    return frontend_process

def main():
    subprocesses = [
        start_backend(),
        start_frontend()
    ]
    for subprocess in subprocesses:
        subprocess.wait()


if __name__ == "__main__":
    main()