import paramiko
import time
import sys

# Connect to the server
hostname = "170.106.88.237"
username = "ubuntu"
password = "naonao@20160920"

print(f"Connecting to {hostname}...")
try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, port=22, username=username, password=password, timeout=10)
    print("Connected successfully!")
    
    # Run the setup script
    commands = """
    killall -9 python3 2>/dev/null
    mkdir -p my_artworks
    cd my_artworks
    
    wget -nc -U "MuseumGalleryApp/1.0 (admin@example.com)" -O van_gogh_potato_eaters.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/The_Potato_Eaters_-_Vincent_van_Gogh.jpg/800px-The_Potato_Eaters_-_Vincent_van_Gogh.jpg"
    wget -nc -U "MuseumGalleryApp/1.0 (admin@example.com)" -O van_gogh_tanguy.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Vincent_van_Gogh_-_Portrait_of_P%C3%A8re_Tanguy_-_Google_Art_Project.jpg/800px-Vincent_van_Gogh_-_Portrait_of_P%C3%A8re_Tanguy_-_Google_Art_Project.jpg"
    wget -nc -U "MuseumGalleryApp/1.0 (admin@example.com)" -O van_gogh_sunflowers.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/800px-Vincent_Willem_van_Gogh_127.jpg"
    wget -nc -U "MuseumGalleryApp/1.0 (admin@example.com)" -O van_gogh_starry_night.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
    wget -nc -U "MuseumGalleryApp/1.0 (admin@example.com)" -O van_gogh_wheat_crows.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg/800px-Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg"
    wget -nc -U "MuseumGalleryApp/1.0 (admin@example.com)" -O frida_two_fridas.jpg "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/The_Two_Fridas.jpg/800px-The_Two_Fridas.jpg"
    wget -nc -U "MuseumGalleryApp/1.0 (admin@example.com)" -O frida_broken_column.jpg "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/The_Broken_Column.jpg/800px-The_Broken_Column.jpg"
    wget -nc -U "MuseumGalleryApp/1.0 (admin@example.com)" -O dali_memory.jpg "https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/800px-The_Persistence_of_Memory.jpg"

    nohup python3 -m http.server 8080 > server.log 2>&1 &
    
    echo "Wait for server to start..."
    sleep 2
    ps aux | grep http.server
    ls -la
    """
    
    print("Executing remote commands...")
    stdin, stdout, stderr = ssh.exec_command(commands)
    
    # Print the output
    print("STDOUT:")
    print(stdout.read().decode())
    print("STDERR:")
    print(stderr.read().decode())
    
    ssh.close()
    print("Done!")

except Exception as e:
    print(f"Failed to connect or execute: {e}")
    sys.exit(1)
