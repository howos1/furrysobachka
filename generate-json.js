const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'img', 'yukimeow');
const outputFile = path.join(__dirname, 'dist', 'yukimeow.json');
const baseUrl = 'https://meow.furrysobachka.ru/img/yukimeow/';

let existingData = [];
if (fs.existsSync(outputFile)) {
  try {
    existingData = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
  } catch (e) {
    console.error('error, retry:', e);
  }
}

const existingUrls = new Set(existingData.map(item => item.url));

fs.readdir(imgDir, (err, files) => {
  if (err) {
    console.error('error:', err);
    process.exit(1);
  }

  const newImages = files
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => {
      const fileUrl = `${baseUrl}${file}`;
      
      if (existingUrls.has(fileUrl)) return null;

      const nameWithoutExt = path.parse(file).name;
      const parts = nameWithoutExt.split('_');
      
      const author = parts[0] || 'Unknown';
      const isBlur = parts.includes('blur');
      const isFemboy = parts.includes('femboy');

      return {
        author: author,
        url: fileUrl,
        blur: isBlur,
        femboy: isFemboy
      };
    })
    .filter(item => item !== null);

  if (newImages.length === 0) {
    console.log('nothing.');
    return;
  }

  const updatedData = [...newImages, ...existingData];

  fs.writeFileSync(outputFile, JSON.stringify(updatedData, null, 2), 'utf-8');
  console.log(`done added: ${newImages.length}.`);
});