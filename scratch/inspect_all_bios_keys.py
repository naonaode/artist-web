import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bios_dir = os.path.join(base_dir, "src", "data", "bios")

for filename in sorted(os.listdir(bios_dir)):
    if filename.endswith(".js") and filename != "index.js":
        path = os.path.join(bios_dir, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        keys = re.findall(r"^\s*['\"]([^'\"]+)['\"]\s*:\s*\{", content, re.M)
        print(f"{filename}: {', '.join(keys)}")
