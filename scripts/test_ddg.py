import os
import ssl
import time
from ddgs import DDGS

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def test_ddg_image(query):
    print(f"🕵️ 正在强力搜寻: {query}")
    try:
        ddgs = DDGS()
        results = ddgs.images(query + " painting masterpiece", max_results=3)
        for r in results:
            url = r.get('image')
            if url and (url.lower().endswith('.jpg') or url.lower().endswith('.jpeg') or url.lower().endswith('.png')):
                print(f"✅ 找到绝佳原图: {url}")
                return url
        print("❌ 未找到合适的图片链接！")
    except Exception as e:
        print(f"💥 鸭鸭杀引擎报错: {e}")

test_ddg_image("Van Gogh women sewing")
test_ddg_image("Frida Kahlo time passes")
test_ddg_image("Salvador Dali Adaptation of Desire")
