import re
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for filename in ["append_batch13.py", "create_append.py"]:
    path = os.path.join(base_dir, filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        keys = re.findall(r"^\s*['\"]([^'\"]+)['\"]\s*:\s*\{", content, re.M)
        print(f"\n{filename} has {len(keys)} keys:")
        for k in keys:
            print(f"  {k}")
