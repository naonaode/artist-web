import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

found = []
for root, dirs, files in os.walk(base_dir):
    if "node_modules" in root or ".git" in root or ".agents" in root:
        continue
    for file in files:
        if file.endswith((".js", ".json", ".py", ".md")):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                if "达希亚·维拉斯科" in content or "Velasco" in content:
                    found.append(path)
            except Exception:
                pass

print("Found in files:")
for f in found:
    print(f"  {f}")
