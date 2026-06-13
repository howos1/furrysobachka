const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'img', 'yukimeow');
const outputFile = path.join(__dirname, 'dist', 'yukimeow.json');

const baseUrl = 'https://meow.furrysobachka.ru/img/yukimeow/';

fs.readdir(imgDir, (err, files) => {
  if (err) {
    console.error('error:', err);
    process.exit(1);
  }

  const jsonResult = files
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => {
      const nameWithoutExt = path.parse(file).name;
      const parts = nameWithoutExt.split('_');
      
      const author = parts[0] || 'Unknown';
      const isBlur = parts.includes('blur');
      const isFemboy = parts.includes('femboy');

      return {
        author: author,
        url: `${baseUrl}${file}`,
        blur: isBlur,
        femboy: isFemboy
      };
    });

  fs.writeFileSync(outputFile, JSON.stringify(jsonResult, null, 2), 'utf-8');
  console.log(`done!: ${jsonResult.length}`);
});