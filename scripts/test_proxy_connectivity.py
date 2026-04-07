import requests
import os
import sys

# User-provided proxy string
proxy_url = "socks5h://jack:123456@170.106.80.237:50000"

proxies = {
    "http": proxy_url,
    "https": proxy_url,
}

def test_connectivity(target_url):
    print(f"Testing connectivity to: {target_url} via Proxy...")
    try:
        response = requests.get(target_url, proxies=proxies, timeout=15)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("✅ Success!")
            if "httpbin" in target_url:
                print(f"Your IP via Proxy: {response.json().get('origin')}")
        return True
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False

if __name__ == "__main__":
    # Ensure requests and PySocks are installed for socks support
    print("Pre-flight check: Verifying requests[socks] support...")
    
    # Run tests
    test_connectivity("http://httpbin.org/ip")
    print("-" * 30)
    test_connectivity("https://www.wikipedia.org")
