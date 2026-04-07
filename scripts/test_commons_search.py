import urllib.request
import urllib.parse
import json
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

queries = [
    "Van Gogh women sewing",
    "Frida Kahlo time passes",
    "Salvador Dali Adaptation of Desire",
    "Frida Kahlo Self Portrait in a Velvet Dress",
    "Klimt Kiss"
]

print("🔬 遵守行动准则：小规模测试 Commons 无限空间搜索")

for q in queries:
    print(f"\n🔍 测试搜索 Commons 全库: {q}")
    # Remove srnamespace=6
    search_url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&format=json"
    req = urllib.request.Request(search_url, headers={'User-Agent': 'MuseumGallery/2.0'})
    try:
        with urllib.request.urlopen(req, context=ctx) as r:
            data = json.loads(r.read())
            results = data['query']['search']
            if results:
                print(f"  ✅ 命中记录 ({len(results)}条):")
                for item in results[:3]:
                    title = item['title']
                    print(f"      - {title}")
            else:
                print("  ❌ 未找到任何匹配项")
    except Exception as e:
        print(f"  ❌ 错误: {e}")
    time.sleep(1)
