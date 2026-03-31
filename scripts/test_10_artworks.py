import os
import ssl
import urllib.request
import time

urls = [
    ("吃土豆的人", "van_gogh_potato_eaters.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/The_Potato_Eaters_-_Vincent_van_Gogh.jpg?width=800"),
    ("唐吉老爹", "van_gogh_tanguy.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent_van_Gogh_-_Portrait_of_P%C3%A8re_Tanguy_-_Google_Art_Project.jpg?width=800"),
    ("向日葵", "van_gogh_sunflowers.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent_Willem_van_Gogh_127.jpg?width=800"),
    ("星夜", "van_gogh_starry_night.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg?width=800"),
    ("麦田群鸦", "van_gogh_wheat_crows.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg?width=800"),
    ("两朵弗里达", "frida_two_fridas.jpg", "https://en.wikipedia.org/wiki/Special:FilePath/The_Two_Fridas.jpg?width=800"),
    ("破碎的柱子", "frida_broken_column.jpg", "https://en.wikipedia.org/wiki/Special:FilePath/The_Broken_Column.jpg?width=800"),
    ("记忆的永恒", "dali_memory.jpg", "https://en.wikipedia.org/wiki/Special:FilePath/The_Persistence_of_Memory.jpg?width=800"),
    ("吻", "klimt_kiss.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Klimt_-_The_Kiss.jpg?width=800"),
    ("印象·日出", "monet_sunrise.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Claude_Monet%2C_Impression%2C_soleil_levant%2C_1872.jpg?width=800")
]

dest_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "artworks")
os.makedirs(dest_dir, exist_ok=True)

# 忽略 SSL 警告
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# 自动处理代理和重定向的高级 Opener，深度伪装为顶级浏览器请求
opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
opener.addheaders = [
    ('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 MuseumGallery/1.0'),
    ('Accept', 'image/webp,image/apng,image/*,*/*;q=0.8')
]

# 如果本地系统开有局域网代理（如 Clash 监听 7890），urllib 也能自动使用探测到的系统代理
urllib.request.install_opener(opener)

print(f"🎬 开始测试稳定抓取引擎，共 {len(urls)} 张传世真迹...")

for name_cn, filename, url in urls:
    dest_path = os.path.join(dest_dir, filename)
    print(f"⬇️ 正在拉取: {name_cn}  --> {filename}")
    try:
        # 防限流处理：每次强行冷却等待一点时间
        time.sleep(1.5)
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=20) as response:
            with open(dest_path, 'wb') as f:
                f.write(response.read())
        print(f"   ✅ 成功接回 {name_cn}")
    except Exception as e:
        print(f"   ❌ 失败 {name_cn}: {str(e)}")

print("\n🎉 第一批 10 张测试大作已安全入库！可以去浏览器查收右侧画廊效果了！")
