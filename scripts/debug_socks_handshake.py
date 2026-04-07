import socket
import struct

def test_socks5_handshake(ip, port, user=None, pw=None):
    print(f"--- Testing SOCKS5 Handshake: {ip}:{port} ---")
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(5)
        s.connect((ip, port))
        print("✅ TCP Connection: Established")

        # First greeting [version, nmethods, methods...]
        # Methods: 0x00 (No Auth), 0x02 (User/Pass)
        greeting = struct.pack("BBBB", 0x05, 0x02, 0x00, 0x02)
        s.sendall(greeting)

        response = s.recv(2)
        if not response:
            print("❌ Server closed connection immediately after greeting.")
            return

        ver, method = struct.unpack("BB", response)
        print(f"📊 Server Response: Version={ver}, Method={method}")

        if method == 0xFF:
            print("❌ Server rejected all authentication methods.")
        elif method == 0x02:
            print("🔑 Server requested User/Password authentication.")
            if user and pw:
                # [ver, user_len, user, pw_len, pw]
                user_bytes = user.encode()
                pw_bytes = pw.encode()
                auth_req = struct.pack("BB", 0x01, len(user_bytes)) + user_bytes + \
                           struct.pack("B", len(pw_bytes)) + pw_bytes
                s.sendall(auth_req)
                auth_res = s.recv(2)
                if auth_res:
                    ver, status = struct.unpack("BB", auth_res)
                    print(f"📊 Auth Result: Version={ver}, Status={status} (0=Success)")
                else:
                    print("❌ Server closed connection after auth request.")
        elif method == 0x00:
            print("🔓 Server accepted 'No Authentication'.")
        
        s.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_socks5_handshake("170.106.80.237", 50000, "jack", "123456")
