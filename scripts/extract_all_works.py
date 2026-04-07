import os
import json
import re

bios_dir = "src/data/bios"
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
full_bios_dir = os.path.join(base_dir, bios_dir)

works_list = []

for filename in sorted(os.listdir(full_bios_dir)):
    if filename.startswith("bios_day") and filename.endswith(".js"):
        filepath = os.path.join(full_bios_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # 使用正则定位每一个艺术家的开端
            matches = re.finditer(r'([\'"])([^\'"]+)\1:\s*\{\s*brief:', content)
            starts = [(m.start(), m.group(2)) for m in matches]
            
            for i, (start_idx, artist) in enumerate(starts):
                end_idx = starts[i+1][0] if i+1 < len(starts) else len(content)
                artist_block = content[start_idx:end_idx]
                
                # 使用正则抓取所有的 representativeWorks 或者 periods.works
                works_matches = re.finditer(r'(?:works|representativeWorks):\s*\[(.*?)\]', artist_block, re.DOTALL)
                for match in works_matches:
                    works_str = match.group(1)
                    # 提炼每幅画的名字
                    names = re.findall(r'"([^"]+)"|\'([^\']+)\'', works_str)
                    for n in names:
                        work_name = n[0] if n[0] else n[1]
                        if work_name.strip() and (artist, work_name.strip()) not in works_list:
                            works_list.append((artist, work_name.strip()))

# 过滤掉我们已经手动测试成功的 10 张图
already_downloaded = ["吃土豆的人", "唐吉老爹", "向日葵", "星夜", "麦田群鸦", "两朵弗里达", "破碎的柱子", "记忆的永恒", "吻", "印象·日出"]
pending_works = [w for w in works_list if w[1] not in already_downloaded]

print(f"✅ 全库扫描完毕！共挖掘出代表画作总数：{len(works_list)} 张")
print(f"🎯 排除掉已下载的 10 张测试大作，还有 {len(pending_works)} 张画卷等待爬取！")

# 存进 json 备用
out_path = os.path.join(base_dir, "scripts", "all_pending_works.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump([{"artist": a, "work": w} for a, w in pending_works], f, ensure_ascii=False, indent=2)

print(f"📄 清单已妥善封存于 {out_path}")
