filepath = 'f:/wmware/artist-web/src/data/artistBios.js'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# find the last line that contains "};"
for i in range(len(lines)-1, -1, -1):
    if '};' in lines[i]:
        idx = i
        break

# remove from idx to end
good_lines = lines[:idx]

append_str = """  },

  // --- BATCH 13 (DAY 361 - DAY 365) ---
  '西斯特·盖茨': {
    brief: "废墟上的炼金术：黑人空间复兴的先知",
    periods: [{ title: "重塑档案", years: "2010s-至今", keywords: ["非裔美国人", "陶艺", "社会复兴"], content: "他不仅仅是一个雕塑家，更是一个城市废墟的复兴者。他将废弃消防站、旧图书馆转化为神圣的档案与艺术殿堂，提炼出黑人历史中的光辉遗迹。", works: ["多切斯特项目"] }]
  },
  '朱莉·梅雷图': {
    brief: "大都会的爆破图：在地图与建筑线中寻找身份",
    periods: [{ title: "全球化地形", years: "2000s-至今", keywords: ["层次重叠", "建筑草图", "旋风"], content: "她在巨大的画布上层层叠加建筑平面图、涂鸦和矢量线条。作品就像是炸开的城市与流动的历史，表现了全球化时代极其混杂、极具扩张性的空间感。", works: ["经验主义系统"] }]
  },
  '大卫·汉蒙斯': {
    brief: "街角的黑色幽默：用雪球和毛发嘲讽神坛",
    periods: [{ title: "街头现成品", years: "1970s-至今", keywords: ["非裔身份", "街头倒卖", "转瞬即逝"], content: "他在冬天去街头叫卖形状完美的雪球，或者用非裔理发店里扫出的头发进行创作。总以最难以捉摸、近乎游击的方式对高雅艺术与种族体制进行讽刺。", works: ["卖雪球"] }]
  },
  '加哈尔·施奈德': {
    brief: "无名深渊的造物主：死去房屋里的压迫静默",
    periods: [{ title: "死亡空间", years: "2000s-至今", keywords: ["黑色房间", "心理压迫", "迷宫"], content: "他在普通画廊内部重建了毫无光线的死胡同公寓、密室或是散发热气的管道房间。迫使观众迷失在极其压抑的物理空间和内心的原初恐惧中。", works: ["死屋", "u r 10"] }]
  },
  '阿尔塔米拉壁画匿名者与AI': {
    brief: "跨越时空的凝视：万物皆画的起点与未来",
    periods: [{ title: "史前与算法", years: "旧石器时代至未来", keywords: ["岩壁", "生成艺术", "人类意识"], content: "从三万年前黑暗洞穴里因敬畏而按下的红黑手印，到今天在硅基芯片中跃动的隐秘算法。无论媒介如何变换，创造的冲动如同暗夜里的火种，生生不息。", works: ["野牛图", "生成的梦境"] }]
  }
};
"""

good_lines.append(append_str)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(good_lines)

print("Batch 13 appended successfully.")
