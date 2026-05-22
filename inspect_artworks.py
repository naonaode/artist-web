import json
import os
import re

# Load artists.json
artists_path = r'D:\mnd\artist-web\src\data\artists.json'
with open(artists_path, 'r', encoding='utf-8') as f:
    artists = json.load(f)

# Load bios
# We can find all bios keys by parsing the js files or using a dynamic approach
# Let's read the contents of bios_day001_010.js and bios_day011_020.js to extract works
bios_files = [
    r'D:\mnd\artist-web\src\data\bios\bios_day001_010.js',
    r'D:\mnd\artist-web\src\data\bios\bios_day011_020.js'
]

bio_works = {}
for filepath in bios_files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # We want to extract the works array inside each artist block
        # A simple regex to find the artist block
        # Let's find "Artist Name": { ... } blocks
        # And within those, find all works lists
        # Alternatively, we can parse it carefully or match lines
        # Let's find matches for: works: [...] or representativeWorks: [...]
        # Let's find the artist name and all works associated with them
        # A robust way is to extract blocks
        blocks = re.findall(r"'([^']+)':\s*\{(.*?)\n\s*\},", content, re.DOTALL)
        for artist_name, block_content in blocks:
            # find all works matches like works: ["...", "..."]
            works_found = []
            works_lists = re.findall(r"works:\s*\[(.*?)\]", block_content)
            for wl in works_lists:
                items = re.findall(r"['\"]([^'\"]+)['\"]", wl)
                works_found.extend(items)
            
            # also representativeWorks: ["...", "..."]
            rep_lists = re.findall(r"representativeWorks:\s*\[(.*?)\]", block_content)
            for rl in rep_lists:
                items = re.findall(r"['\"]([^'\"]+)['\"]", rl)
                works_found.extend(items)
            
            # De-duplicate
            unique_works = []
            for w in works_found:
                if w not in unique_works:
                    unique_works.append(w)
            bio_works[artist_name] = unique_works

# Load artworks.js mapping
artworks_path = r'D:\mnd\artist-web\src\data\artworks.js'
with open(artworks_path, 'r', encoding='utf-8') as f:
    artworks_content = f.read()

# We can parse key-value pairs in artworks.js
# Matches like: "自画像": "/artworks/文森特_梵高_自画像.jpg",
# or "吃土豆的人": `${IMAGE_HOST}van_gogh_potato_eaters.jpg`,
# Let's normalize it to find the actual filenames
artwork_mappings = {}
# Let's find all lines with pattern "key": "value" or "key": `${IMAGE_HOST}value`
lines = artworks_content.split('\n')
for line in lines:
    line = line.strip()
    if line.startswith('//') or not line:
        continue
    # match "key": "val" or "key": `${IMAGE_HOST}val`
    match = re.match(r"['\"]([^'\"]+)['\"]\s*:\s*(.*),?", line)
    if match:
        key = match.group(1)
        val_expr = match.group(2)
        # Parse the expression to get local path
        val_expr = val_expr.rstrip(',').strip()
        if '${IMAGE_HOST}' in val_expr:
            filename = re.findall(r"IMAGE_HOST\}([^'\"]+)", val_expr)
            if filename:
                path = '/artworks/' + filename[0]
            else:
                path = val_expr
        else:
            path = re.sub(r"['\"]", "", val_expr)
        artwork_mappings[key] = path

print("\n--- Biographies Works analysis (First 10 artists) ---")
artworks_dir = r'D:\mnd\artist-web\public\artworks'
for i in range(10):
    artist = artists[i]
    name = artist['name']
    print(f"\nArtist: {name} (Day {artist['day']})")
    works = bio_works.get(name, [])
    if not works:
        print("  No works found in bio JS files.")
        continue
    
    for work in works:
        mapped_path = artwork_mappings.get(work)
        if mapped_path:
            # Check if local file exists
            local_filename = os.path.basename(mapped_path)
            local_path = os.path.join(artworks_dir, local_filename)
            exists = os.path.exists(local_path)
            size = os.path.getsize(local_path) if exists else 0
            print(f"  - Work: '{work}' | Mapped: {mapped_path} | Local Exists: {exists} | Size: {size/1024:.1f} KB")
        else:
            print(f"  - Work: '{work}' | NOT Mapped in artworks.js!")
