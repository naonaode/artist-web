import os
import shutil
from icrawler.builtin import BingImageCrawler

def test_bing_search(query):
    print(f"\n🕵️ 引擎：BingImageCrawler | 目标: {query}")
    save_dir = "test_images"
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
        
    try:
        # Create crawler, downloading to save_dir
        bing_crawler = BingImageCrawler(
            feeder_threads=1,
            parser_threads=1,
            downloader_threads=1,
            storage={'root_dir': save_dir}
        )
        # Search for highest matched image
        bing_crawler.crawl(keyword=query + " high resolution masterpiece", max_num=1)
        print(f"  ✅ 命令已分发，请检查 {save_dir} 目录查看是否下载成功。")
    except Exception as e:
        print(f"  💥 搜寻引擎报错: {e}")

queries = [
    "Van Gogh women sewing painting",
    "Frida Kahlo time passes painting",
    "Salvador Dali Adaptation of Desire painting"
]

print("🔬 遵守行动准则：小规模测试 BingImageCrawler 引擎")
for q in queries:
    test_bing_search(q)

