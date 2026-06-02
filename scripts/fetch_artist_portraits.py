import os
import json
import urllib.request
import urllib.parse
import ssl
import time
import shutil
import glob
from icrawler.builtin import BingImageCrawler

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
artists_json_path = os.path.join(base_dir, "src", "data", "artists.json")
artist_images_path = os.path.join(base_dir, "src", "data", "artistImages.js")
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

def search_icrawler_avatar(en_query, out_path):
    temp_dir = os.path.join(base_dir, "scripts", "temp_avatar")
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
        # Search for artist portrait/avatar
        crawler.crawl(keyword=en_query + " artist portrait photo", max_num=1)
        
        files = glob.glob(os.path.join(temp_dir, "*"))
        if files:
            downloaded = files[0]
            shutil.copy(downloaded, out_path)
            return True
        return False
    except Exception as e:
        print(f"  [iCrawler Err] {e}")
        return False
    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

def main():
    # 1. Load current artistImages.js
    existing_images = {}
    if os.path.exists(artist_images_path):
        with open(artist_images_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # simple parsing of lines like "  '草间弥生': '/hero_images/kusama.png',"
            for line in content.split('\n'):
                if ':' in line and '/' in line:
                    parts = line.split(':')
                    k = parts[0].strip().replace("'", "").replace('"', '')
                    v = parts[1].strip().replace("'", "").replace('"', '').rstrip(',')
                    existing_images[k] = v

    # 2. Extract active artists from public/artworks files
    active_artists = set()
    for filename in os.listdir(public_artworks_dir):
        if '_' in filename and not filename.endswith('_avatar.png') and not filename.endswith('_avatar.jpg'):
            # e.g. "卡拉瓦乔_圣保罗的改宗.jpg" -> "卡拉瓦乔"
            # or "让-米歇尔_巴斯奎特_铁甲王.jpg" -> "让-米歇尔_巴斯奎特"
            artist_part = filename.split('_')[0]
            # Replace underscore back to dot to match name in artists.json
            artist_part_dotted = artist_part.replace('_', '·')
            active_artists.add(artist_part_dotted)
            
    # Also add the artists who already have avatars in target map just in case
    for k in existing_images.keys():
        active_artists.add(k)

    print(f"🎨 Detected {len(active_artists)} active artists in the gallery!")

    # 3. Load artists.json to map correct names
    try:
        with open(artists_json_path, 'r', encoding='utf-8') as f:
            all_artists = json.load(f)
    except FileNotFoundError:
        print("❌ Cannot find artists.json!")
        return

    # Filter all_artists to active ones
    artists_to_process = []
    for artist in all_artists:
        name = artist['name']
        # normalize names for matching
        normalized_active = {a.replace('·', '').replace('_', '') for a in active_artists}
        normalized_name = name.replace('·', '').replace('_', '')
        if normalized_name in normalized_active:
            artists_to_process.append(name)

    print(f"🚀 Found {len(artists_to_process)} artists to verify portraits.")

    updated_images = existing_images.copy()
    new_downloads = 0

    for name in artists_to_process:
        # Check if already has avatar in existing_images
        if name in existing_images:
            path_val = existing_images[name]
            local_file = path_val.lstrip('/')
            # Check if file exists locally
            if os.path.exists(os.path.join(base_dir, "public", local_file)):
                print(f"  ⏭️ {name} already has a valid portrait: {path_val}")
                continue

        print(f"📷 Fetching portrait for: {name}")
        en_name = translate_to_en(name) or name
        print(f"  -> Translated: '{en_name}'")

        safe_filename = f"{name}_avatar.jpg".replace("/", "_").replace("\\", "_").replace(" ", "_").replace("·", "_")
        out_path = os.path.join(public_artworks_dir, safe_filename)

        # Check if file already exists locally but not registered
        if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
            print(f"  ⏭️ Local portrait file exists ({safe_filename}), registering path directly")
            success = True
        else:
            success = search_icrawler_avatar(en_name, out_path)
            time.sleep(2)

        if success:
            relative_path = f"/artworks/{safe_filename}"
            print(f"  ✅ Portrait mapped: {relative_path}")
            updated_images[name] = relative_path
            new_downloads += 1
        else:
            print(f"  ❌ Failed to download portrait for {name}")

    print("--------------------------------------------------")
    print(f"🎯 Portrait job finished. Mapped {new_downloads} new portraits.")

    # Write back to artistImages.js
    if new_downloads > 0 or not os.path.exists(artist_images_path):
        js_lines = [
            "// Local AI generated or crawled hero portraits",
            "// Format: artist Chinese name → local public url",
            "const ARTIST_IMAGES = {"
        ]
        for k, v in sorted(updated_images.items()):
            js_lines.append(f"  '{k}': '{v}',")
        js_lines.append("};")
        js_lines.append("")
        js_lines.append("export default ARTIST_IMAGES;")
        js_lines.append("")

        with open(artist_images_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(js_lines))
        print("💾 artistImages.js updated successfully!")

if __name__ == "__main__":
    main()
