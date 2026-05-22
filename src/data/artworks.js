// 本地真迹图库 - 无需外部请求网络，丝滑秒开
const IMAGE_HOST = "/artworks/"; 

const ARTWORK_IMAGES = {
  // Namespace and Clash Resolution
  "文森特·梵高_自画像": "/artworks/文森特_梵高_自画像.jpg",
  "埃贡·席勒_自画像": "/artworks/schiele_avatar.png", // Correctly maps Schiele's own expressive face!
  "自画像": "/artworks/文森特_梵高_自画像.jpg",
  "鸢尾花": "/artworks/文森特_梵高_鸢尾花.jpg",

  // 梵高 (Day 001)
  "吃土豆的人": `${IMAGE_HOST}van_gogh_potato_eaters.png`,
  "唐吉老爹": `${IMAGE_HOST}van_gogh_tanguy.png`,
  "向日葵": `${IMAGE_HOST}van_gogh_sunflowers.jpg`,
  "星夜": `${IMAGE_HOST}van_gogh_starry_night.jpg`,
  "麦田群鸦": `${IMAGE_HOST}van_gogh_wheat_crows.jpg`,

  // 弗里达 (Day 002)
  "时间在流逝": `${IMAGE_HOST}frida_time_flies.png`,
  "弗里达与迭戈·里维拉": `${IMAGE_HOST}frida_and_diego.png`,
  "万岁，生命！": `${IMAGE_HOST}frida_viva_la_vida.png`,
  "两朵弗里达": `${IMAGE_HOST}frida_two_fridas.jpg`,
  "破碎的柱子": `${IMAGE_HOST}frida_broken_column.jpg`,
  "戴有荆棘项链的自画像": `${IMAGE_HOST}frida_thorn_necklace.png`,

  // 达利 (Day 003)
  "记忆的永恒": `${IMAGE_HOST}dali_memory.jpg`,
  "龙虾电话": `${IMAGE_HOST}dali_lobster_phone.png`,

  // 克里姆特 (Day 009)
  "吻": `${IMAGE_HOST}klimt_kiss.jpg`,

  // 莫奈 (Day 034)
  "印象·日出": `${IMAGE_HOST}monet_sunrise.jpg`,

};

export default ARTWORK_IMAGES;
