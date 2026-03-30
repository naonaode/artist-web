import re
import json

filepath = 'f:/wmware/artist-web/src/data/artistBios.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# find keys that look like 'Artist Name': {
keys = re.findall(r"'([^']+)':\s*\{", content)
print("Total keys found:", len(keys))

# load artists.json to compare
with open('f:/wmware/artist-web/src/data/artists.json', 'r', encoding='utf-8') as f:
    all_artists = json.load(f)

all_names = [a['name'] for a in all_artists]

missing = [name for name in all_names if name not in keys]

print("Total in artists.json:", len(all_names))
print("Missing count:", len(missing))
print("First 5 missing:", missing[:5])
print("Missing indices (0-based):")
for i, name in enumerate(all_names):
    if name not in keys:
        print(f"Index {i} (Day {i+1}): {name}")
