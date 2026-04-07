import socket
import struct

def test_variants(ip, port):
    variants = [
        ("SOCKS5 (No Auth/UserPass)", struct.pack("BBBB", 0x05, 0x02, 0x00, 0x02)),
        ("SOCKS5 (No Auth Only)", struct.pack("BBB", 0x05, 0x01, 0x00)),
        ("SOCKS4 (No Auth)", struct.pack("BBHI", 0x04, 0x01, 80, 0x00000001) + b"user\x00"),
    ]

    for name, greeting in variants:
        print(f"\n--- Testing variant: {name} ---")
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(10) # 调大到 10 秒
            s.connect((ip, port))
            print("✅ TCP: Connected")
            
            s.sendall(greeting)
            res = s.recv(1024)
            if res:
                print(f"📊 Response (Hex): {res.hex()}")
            else:
                print("❌ Server closed connection (no data).")
            s.close()
        except socket.timeout:
            print("⏳ Error: Timed out waiting for response.")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_variants("170.106.80.237", 50000)
