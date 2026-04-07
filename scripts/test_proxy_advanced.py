import requests
import unittest

def test_proxy(url_scheme, proxy_ip, proxy_port, user, password, target_url):
    proxy_url = f"{url_scheme}://{user}:{password}@{proxy_ip}:{proxy_port}"
    proxies = { "http": proxy_url, "https": proxy_url }
    print(f"Testing {url_scheme} to {target_url}...")
    try:
        r = requests.get(target_url, proxies=proxies, timeout=10)
        print(f"  Success! Status: {r.status_code}")
        if "httpbin" in target_url:
            print(f"  IP: {r.json().get('origin')}")
        return True
    except Exception as e:
        print(f"  Failed: {e}")
        return False

if __name__ == "__main__":
    ip = "170.106.80.237"
    port = "50000"
    u = "jack"
    p = "123456"

    # Test 1: socks5h
    test_proxy("socks5h", ip, port, u, p, "http://httpbin.org/ip")
    
    # Test 2: socks5 (local DNS)
    test_proxy("socks5", ip, port, u, p, "http://httpbin.org/ip")
    
    # Test 3: Wikipedia
    test_proxy("socks5h", ip, port, u, p, "https://www.wikipedia.org")
