// 本地真迹图库 - 无需外部请求网络，丝滑秒开
const IMAGE_HOST = "/artworks/"; 

const ARTWORK_IMAGES = {
  // 梵高 (Day 001)
  "吃土豆的人": `${IMAGE_HOST}van_gogh_potato_eaters.jpg`,
  "唐吉老爹": `${IMAGE_HOST}van_gogh_tanguy.jpg`,
  "向日葵": `${IMAGE_HOST}van_gogh_sunflowers.jpg`,
  "星夜": `${IMAGE_HOST}van_gogh_starry_night.jpg`,
  "麦田群鸦": `${IMAGE_HOST}van_gogh_wheat_crows.jpg`,

  // 弗里达 (Day 002)
  "两朵弗里达": `${IMAGE_HOST}frida_two_fridas.jpg`,
  "破碎的柱子": `${IMAGE_HOST}frida_broken_column.jpg`,

  // 达利 (Day 003)
  "记忆的永恒": `${IMAGE_HOST}dali_memory.jpg`,

  // 克里姆特 (Day 009)
  "吻": `${IMAGE_HOST}klimt_kiss.jpg`,

  // 莫奈 (例子)
  "印象·日出": `${IMAGE_HOST}monet_sunrise.jpg`
};

export default ARTWORK_IMAGES;
