import urllib.request
import urllib.parse
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def test_wikiart(query):
    print(f"\n🕵️ 正在搜寻 WikiArt: {query}")
    try:
        url = "https://www.wikiart.org/en/search/" + urllib.parse.quote(query) + "/1"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, context=ctx) as r:
            html = r.read().decode('utf-8', errors='ignore')
            # Look for typical wikiart image URL: https://uploads.wikiart.org/images/...jpg!Large.jpg
            matches = re.findall(r'(https://uploads\d*\.wikiart\.org/[^"]+?\.jpg)', html)
            if matches:
                print(f"  ✅ 发现WikiArt原图: {matches[0]}")
                return matches[0]
            print("  ❌ 页面未包含画作链接")
    except Exception as e:
        print(f"  💥 WikiArt访问报错: {e}")

queries = [
    "Van Gogh women sewing",
    "Frida Kahlo time passes",
    "Salvador Dali Adaptation of Desire"
]

print("🔬 遵守行动准则：小规模测试 WikiArt.org 爬虫方案")
for q in queries:
    test_wikiart(q)
