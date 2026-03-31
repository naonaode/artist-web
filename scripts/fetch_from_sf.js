const fs = require('fs');
const https = require('https');
const path = require('path');

// 要测试的前 001-010 期艺术巨匠的画作列表（维基高质 800px 缩略图）
const urls = [
  { name: "van_gogh_potato_eaters.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/The_Potato_Eaters_-_Vincent_van_Gogh.jpg/800px-The_Potato_Eaters_-_Vincent_van_Gogh.jpg" },
  { name: "van_gogh_tanguy.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Vincent_van_Gogh_-_Portrait_of_P%C3%A8re_Tanguy_-_Google_Art_Project.jpg/800px-Vincent_van_Gogh_-_Portrait_of_P%C3%A8re_Tanguy_-_Google_Art_Project.jpg" },
  { name: "van_gogh_sunflowers.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/800px-Vincent_Willem_van_Gogh_127.jpg" },
  { name: "van_gogh_starry_night.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg" },
  { name: "van_gogh_wheat_crows.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg/800px-Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg" },
  { name: "frida_two_fridas.jpg", url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/The_Two_Fridas.jpg/800px-The_Two_Fridas.jpg" },
  { name: "frida_broken_column.jpg", url: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/The_Broken_Column.jpg/800px-The_Broken_Column.jpg" },
  { name: "dali_memory.jpg", url: "https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/800px-The_Persistence_of_Memory.jpg" }
];

const DIR = path.join(__dirname, 'artworks');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject); // 处理跳转
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Status ${response.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(dest, () => reject(err)); });
  });
}

async function run() {
  console.log("🚀 开始从旧金山服务器飞速拉取维基图库...");
  for (const item of urls) {
    const dest = path.join(DIR, item.name);
    try {
      await downloadFile(item.url, dest);
      console.log(`✅ [下载成功]: ${item.name}`);
    } catch (e) {
      console.log(`❌ [下载失败]: ${item.name} - ${e.message}`);
    }
  }
  console.log("\n🎉 全部下载完成！");
  console.log("👉 请在此目录下运行: python3 -m http.server 8080");
  console.log("👉 以便允许外网访问这些大作图库！");
}

run();
