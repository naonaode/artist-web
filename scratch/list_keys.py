import re
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = os.path.join(base_dir, "append_missing.py")
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

keys = re.findall(r"^\s*['\"]([^'\"]+)['\"]\s*:\s*\{", content, re.M)
print(f"Found {len(keys)} keys:")
for k in keys:
    print(f"  {k}")
