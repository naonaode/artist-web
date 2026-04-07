import urllib.request
import urllib.parse
import re
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def test_yahoo_image(query):
    print(f"\n🕵️ 正在强力搜寻 Yahoo: {query}")
    try:
        url = "https://images.search.yahoo.com/search/images?p=" + urllib.parse.quote(query)
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        with urllib.request.urlopen(req, context=ctx) as r:
            html = r.read().decode('utf-8')
            # Extract image URLs from the JSON data embedded in the page or img src
            # Typical yahoo img JSON format contains imgurl=&quot;https://...&quot;
            matches = re.findall(r'imgurl=&quot;(http[^&]+)&quot;', html)
            if matches:
                for img_url in matches[:3]: # top 3
                    img_url = urllib.parse.unquote(img_url)
                    if img_url.lower().endswith(('.jpg', '.jpeg', '.png')):
                        print(f"  ✅ 发现绝佳原图: {img_url}")
                        return img_url
            print("  ❌ 未找到合适的图片链接！")
    except Exception as e:
        print(f"  💥 搜寻引擎报错: {e}")

queries = [
    "Van Gogh women sewing painting masterpiece",
    "Frida Kahlo time passes painting masterpiece",
    "Salvador Dali Adaptation of Desire painting masterpiece"
]

print("🔬 遵守行动准则：小规模测试 Yahoo Image Search 爬虫方案")
for q in queries:
    test_yahoo_image(q)
    time.sleep(2)
