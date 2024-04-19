import os
import subprocess

def start_backend():
    os.chdir('backend')
    print("Starting backend server...")
    backend_process = subprocess.Popen(['uvicorn', 'main:app', '--host', '0.0.0.0'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    # Continuously read stderr until "Application startup complete." message is found
    while True:
        line = backend_process.stderr.readline().strip()
        if line:
            print(line)
        if "Application startup complete." in line:
            print("Backend server is up and running.")
            break

    return backend_process

def start_frontend():
    os.chdir('../frontend')
    print("Starting frontend server...")
    frontend_process = subprocess.Popen(['ng', 'serve', '--host', '0.0.0.0'])

    return frontend_process

if __name__ == "__main__":
    backend_process = start_backend()
    frontend_process = start_frontend()

    try:
        frontend_process.wait()
    except KeyboardInterrupt:
        print("Shutting down servers...")
        backend_process.terminate()
        frontend_process.terminate()