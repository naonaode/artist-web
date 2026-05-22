import os
import json
import re

base_dir = os.path.dirname(os.path.abspath(__file__))
artists_json_path = os.path.join(base_dir, "src", "data", "artists.json")

with open(artists_json_path, 'r', encoding='utf-8') as f:
    artists = json.load(f)

artist_days = {a['name']: a['day'] for a in artists}

bios_dir = os.path.join(base_dir, "src", "data", "bios")

for filename in sorted(os.listdir(bios_dir)):
    if filename.endswith(".js") and filename != "index.js":
        # Extract the day range from the filename, e.g. bios_day111_120.js -> 111, 120
        match = re.search(r"day(\d+)_(\d+)", filename)
        if not match:
            continue
        start_day = int(match.group(1))
        end_day = int(match.group(2))
        
        path = os.path.join(bios_dir, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            keys = re.findall(r"['\"]([^'\"]+)['\"]\s*:\s*\{", content)
            
            print(f"\n{filename} (Expected Day {start_day}-{end_day}):")
            for key in keys:
                day_in_json = artist_days.get(key, None)
                if day_in_json is None:
                    print(f"  ❌ Key '{key}' NOT found in artists.json!")
                elif day_in_json < start_day or day_in_json > end_day:
                    print(f"  ⚠️ Key '{key}' belongs to Day {day_in_json} (Out of range!)")
                else:
                    print(f"  ✅ Key '{key}' (Day {day_in_json})")
