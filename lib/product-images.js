// Product Image URLs mapped by product ID
// Using free, high-quality product images from Unsplash and placeholder services

const PRODUCT_IMAGES = {
  // Televisions
  'TV001': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
  'TV002': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop',
  'TV003': 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=300&fit=crop',
  'TV004': 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&h=300&fit=crop',
  'TV005': 'https://images.unsplash.com/photo-1571415060716-baff5f717f66?w=400&h=300&fit=crop',

  // Home Appliances
  'FR001': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop',
  'FR002': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop',
  'FR003': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
  'MW001': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop',
  'MW002': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=300&fit=crop',
  'WM001': 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400&h=300&fit=crop',
  'WM002': 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&h=300&fit=crop',
  'AC001': 'https://images.unsplash.com/photo-1631545806609-30b27c37b31e?w=400&h=300&fit=crop',
  'AC002': 'https://images.unsplash.com/photo-1631744758907-3e71a5fb2f8b?w=400&h=300&fit=crop',

  // Mobile Phones
  'PH001': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop',
  'PH002': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop',
  'PH003': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop',
  'PH004': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  'PH005': 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop',
  'PH006': 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop',
  'PH007': 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=300&fit=crop',

  // Laptops
  'LP001': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
  'LP002': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop',
  'LP003': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  'LP004': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
  'LP005': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
  'LP006': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop',

  // Tablets
  'TB001': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
  'TB002': 'https://images.unsplash.com/photo-1561154464-82e9aab41e1f?w=400&h=300&fit=crop',
  'TB003': 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=300&fit=crop',
  'TB004': 'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=400&h=300&fit=crop',

  // Audio & Headphones
  'AU001': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop',
  'AU002': 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=300&fit=crop',
  'AU003': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop',
  'AU004': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop',
  'AU005': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
  'AU006': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',

  // Smartwatches
  'SW001': 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=300&fit=crop',
  'SW002': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=300&fit=crop',
  'SW003': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop',
  'SW004': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=300&fit=crop',

  // Gaming Consoles
  'GM001': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
  'GM002': 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop',
  'GM003': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop',
  'GM004': 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop',

  // Cameras
  'CM001': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  'CM002': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
  'CM003': 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400&h=300&fit=crop',
  'CM004': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop',

  // Smart Home
  'SH001': 'https://images.unsplash.com/photo-1543512214-318228f0a498?w=400&h=300&fit=crop',
  'SH002': 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=300&fit=crop',
  'SH003': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop',
  'SH004': 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=300&fit=crop',

  // Computer Accessories
  'CA001': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  'CA002': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
  'CA003': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
  'CA004': 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop',
};

// Category icons (emoji mapping)
const CATEGORY_ICONS = {
  'Televisions': '📺',
  'Home Appliances': '🏠',
  'Mobile Phones': '📱',
  'Laptops': '💻',
  'Tablets': '📱',
  'Audio & Headphones': '🎧',
  'Smartwatches': '⌚',
  'Gaming Consoles': '🎮',
  'Cameras': '📷',
  'Smart Home': '🏡',
  'Computer Accessories': '🖱️',
};

module.exports = { PRODUCT_IMAGES, CATEGORY_ICONS };
