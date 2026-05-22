import os
import json
import re

base_dir = os.path.dirname(os.path.abspath(__file__))
artists_json_path = os.path.join(base_dir, "src", "data", "artists.json")
bios_dir = os.path.join(base_dir, "src", "data", "bios")

# 1. Load artists
with open(artists_json_path, 'r', encoding='utf-8') as f:
    artists = json.load(f)

artist_names = [a['name'] for a in artists]
print(f"Total artists in artists.json: {len(artist_names)}")

# 2. Extract keys from all bios JS files
bio_keys = set()
for filename in os.listdir(bios_dir):
    if filename.endswith(".js") and filename != "index.js":
        path = os.path.join(bios_dir, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Find patterns like 'Artist Name': { or "Artist Name": {
            keys = re.findall(r"['\"]([^'\"]+)['\"]\s*:\s*\{", content)
            bio_keys.update(keys)

print(f"Total biography keys found in bios files: {len(bio_keys)}")

# 3. Compare
missing = [name for name in artist_names if name not in bio_keys]
print(f"Total missing bios: {len(missing)}")
if missing:
    print("Missing names:")
    for idx, name in enumerate(missing):
        # find the artist's day
        artist_obj = next(a for a in artists if a['name'] == name)
        print(f"  Day {artist_obj['day']}: {name}")
else:
    print("✅ No missing biographies found!")
