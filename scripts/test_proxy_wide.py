import requests

def test(p_url):
    proxies = {"http": p_url, "https": p_url}
    print(f"Testing {p_url}...")
    try:
        r = requests.get("http://httpbin.org/ip", proxies=proxies, timeout=5)
        print(f"  OK: {r.json().get('origin')}")
        return True
    except Exception as e:
        print(f"  Fail: {e}")
        return False

ip = "170.106.80.237"
port = "50000"
u = "jack"
p = "123456"

# Permutations
tests = [
    f"socks5h://{u}:{p}@{ip}:{port}",
    f"socks5://{u}:{p}@{ip}:{port}",
    f"socks5h://{ip}:{port}",
    f"http://{u}:{p}@{ip}:{port}",
    f"http://{ip}:{port}",
]

for t in tests:
    test(t)
