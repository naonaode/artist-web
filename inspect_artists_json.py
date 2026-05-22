import os
import json

base_dir = os.path.dirname(os.path.abspath(__file__))
artists_json_path = os.path.join(base_dir, "src", "data", "artists.json")

with open(artists_json_path, 'r', encoding='utf-8') as f:
    artists = json.load(f)

# Sort by day
artists = sorted(artists, key=lambda x: x['day'])

for a in artists[110:150]:
    print(f"Day {a['day']}: {a['name']}")
