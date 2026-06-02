import os
import json
import urllib.request
import urllib.parse
import ssl
import time
import shutil
import glob
import logging
from icrawler.builtin import BingImageCrawler

# 屏蔽无关日志
logging.getLogger('icrawler').setLevel(logging.WARNING)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pending_path = os.path.join(base_dir, "scripts", "all_pending_works.json")
artworks_js_path = os.path.join(base_dir, "src", "data", "artworks.js")
public_artworks_dir = os.path.join(base_dir, "public", "artworks")

# Helper: Translate ZH to EN natively via Google API
def translate_to_en(text):
    try:
        url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=' + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
        data = json.loads(res)
        return data[0][0][0]
    except Exception as e:
        print(f"  [Translate Err] {e}")
        return None

def search_icrawler_image(en_query, out_path):
    temp_dir = os.path.join(base_dir, "scripts", "temp_fetch")
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir)
    
    try:
        crawler = BingImageCrawler(
            feeder_threads=1,
            parser_threads=1,
            downloader_threads=1,
            storage={'root_dir': temp_dir}
        )
        # Search "painting masterpiece"
        crawler.crawl(keyword=en_query + " painting masterpiece", max_num=1)
        
        files = glob.glob(os.path.join(temp_dir, "*"))
        if files:
            downloaded = files[0]
            # Copy to out_path
            shutil.copy(downloaded, out_path)
            return True
        return False
    except Exception as e:
        print(f"  [iCrawler Err] {e}")
        return False
    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

def process_batch():
    if not os.path.exists(public_artworks_dir):
        os.makedirs(public_artworks_dir)
        
    try:
        with open(pending_path, 'r', encoding='utf-8') as f:
            pending = json.load(f)
    except FileNotFoundError:
        print("❌ 找不到 all_pending_works.json！")
        return

    if not pending:
        print("🎉 任务队列为空，所有名画已抓取完毕！")
        return

    BATCH_SIZE = len(pending) # Process the entire remaining queue!
    print(f"🚀 启动特战小队！开始通过 icrawler 抓取全部 {BATCH_SIZE} 幅未录入画作...\n")
    
    batch = pending[:BATCH_SIZE] # FETCH BATCH
    results = []
    
    for item in batch:
        artist, work = item['artist'], item['work']
        print(f"正在锁定目标：【{artist} - {work}】")
        
        en_artist = translate_to_en(artist) or artist
        en_work = translate_to_en(work) or work
        en_query = f"{en_artist} {en_work}"
            
        print(f"  -> 翻译为英文指令: '{en_query}'")
        
        safe_filename = f"{artist}_{work}.jpg".replace("/", "_").replace("\\", "_").replace(" ", "_").replace("·", "_")
        out_path = os.path.join(public_artworks_dir, safe_filename)
        
        # Check if already downloaded (idempotency)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
            print(f"  ⏭️ 检测到本地文件已存在 ({safe_filename})，跳过抓取")
            success = True
        else:
            # Search & Download via iCrawler
            success = search_icrawler_image(en_query, out_path)
            time.sleep(2) # rate limiting
        
        if success:
            relative_path = f"/artworks/{safe_filename}"
            print(f"  ✅ 引擎匹配成功，高清原图已就位 ({relative_path})\n")
            results.append((work, relative_path))
        else:
            print(f"  ❌ 抓取失败\n")
        
    print("--------------------------------------------------")
    print(f"🎯 侦察排任务完成！成功捕获 {len(results)}/{len(batch)} 幅传世原图！")
    
    # Auto-update artworks.js safely
    if results:
        with open(artworks_js_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
            
        # Use Regex to cleanly insert new paths right after const ARTWORK_IMAGES = {
        insert_block = ""
        for (w, p) in results:
            insert_block += f'  "{w}": "{p}",\n'
            
        if "const ARTWORK_IMAGES = {" in js_content:
            new_content = js_content.replace(
                "const ARTWORK_IMAGES = {",
                f"const ARTWORK_IMAGES = {{\n{insert_block}"
            )
            with open(artworks_js_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("💾 数据库自动装载完毕！[artworks.js已更新]")
            
        # Remove this batch from the pending array logic so we don't repeat them
        remaining = pending[len(batch):]
        with open(pending_path, 'w', encoding='utf-8') as f:
            json.dump(remaining, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    process_batch()
