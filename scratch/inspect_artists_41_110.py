import os
import json

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
artists_path = os.path.join(base_dir, "src", "data", "artists.json")

with open(artists_path, 'r', encoding='utf-8') as f:
    artists = json.load(f)

artists = sorted(artists, key=lambda x: x['day'])

print("Days 41-110:")
for a in artists[40:110]:
    print(f"Day {a['day']}: {a['name']}")
