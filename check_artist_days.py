import os
import json
import re

base_dir = os.path.dirname(os.path.abspath(__file__))
artists_json_path = os.path.join(base_dir, "src", "data", "artists.json")

with open(artists_json_path, 'r', encoding='utf-8') as f:
    artists = json.load(f)

artist_names = {a['name']: a['day'] for a in artists}

bios_dir = os.path.join(base_dir, "src", "data", "bios")
bio_keys = {}

for filename in sorted(os.listdir(bios_dir)):
    if filename.endswith(".js") and filename != "index.js":
        path = os.path.join(bios_dir, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            keys = re.findall(r"['\"]([^'\"]+)['\"]\s*:\s*\{", content)
            for key in keys:
                bio_keys[key] = filename

print("--- Phase 1: Bio keys NOT in artists.json ---")
for key, filename in bio_keys.items():
    if key not in artist_names:
        print(f"Key '{key}' in {filename} but NOT in artists.json")

print("\n--- Phase 2: Names in artists.json NOT in Bios ---")
missing_count = 0
for name, day in sorted(artist_names.items(), key=lambda x: x[1]):
    if name not in bio_keys:
        missing_count += 1
        print(f"Day {day}: '{name}' is missing from Bios")
print(f"\nTotal missing: {missing_count}")
