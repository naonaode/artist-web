import os
import json

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
artists_path = os.path.join(base_dir, "src", "data", "artists.json")

with open(artists_path, 'r', encoding='utf-8') as f:
    artists = json.load(f)

# Filter days 111 to 150
target_artists = [a for a in artists if 111 <= a['day'] <= 150]
target_artists = sorted(target_artists, key=lambda x: x['day'])

print(f"Target Artists ({len(target_artists)}):")
for a in target_artists:
    print(f"Day {a['day']}: {a['name']} ({a.get('enName', '')}) | {a.get('country', '')} | {a.get('genre', '')}")
