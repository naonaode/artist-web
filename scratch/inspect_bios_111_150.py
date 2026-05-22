import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bios_dir = os.path.join(base_dir, "src", "data", "bios")

for filename in ["bios_day111_120.js", "bios_day121_130.js", "bios_day131_140.js", "bios_day141_150.js"]:
    path = os.path.join(bios_dir, filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        keys = re.findall(r"['\"]([^'\"]+)['\"]\s*:\s*\{", content)
        print(f"\n{filename}:")
        for k in keys:
            print(f"  {k}")
