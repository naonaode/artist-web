import urllib.request
import urllib.parse
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

queries = ["梵高 星夜", "唐吉老爹", "弗里达 破碎的柱子", "莫奈 印象·日出", "克里姆特 吻"]
for q in queries:
    # 1. Search Wikipedia ZH for the painting article
    search_url = f"https://zh.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&format=json"
    req = urllib.request.Request(search_url, headers={'User-Agent': 'MuseumGallery/1.0 (admin@example.com)'})
    try:
        with urllib.request.urlopen(req, context=ctx) as r:
            data = json.loads(r.read())
            results = data['query']['search']
            if results:
                title = results[0]['title']
                
                # 2. Get the official masterpiece image from the article summary
                summary_url = f"https://zh.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(title)}"
                req_sum = urllib.request.Request(summary_url, headers={'User-Agent': 'MuseumGallery/1.0 (admin@example.com)'})
                with urllib.request.urlopen(req_sum, context=ctx) as r_sum:
                    sum_data = json.loads(r_sum.read())
                    if 'originalimage' in sum_data:
                        img_url = sum_data['originalimage']['source']
                        # Strip raw URL to formulate the Special:FilePath standard
                        filename = img_url.split('/')[-1]
                        final_url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{urllib.parse.quote(filename)}?width=800"
                        print(f"[{q}] ✅ 成功找到原画: {title} -> {final_url}")
                    else:
                        print(f"[{q}] ⚠️ 找到条目 '{title}'，但该词条未挂载原画")
            else:
                print(f"[{q}] ❌ 维基百科未收录此画作词条")
    except Exception as e:
        print(f"[{q}] ❌ 报错: {e}")
