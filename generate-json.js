const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'img', 'yukimeow');
const outputFile = path.join(__dirname, 'dist', 'yukimeow.json');

const baseUrl = 'https://meow.furrysobachka.ru/img/yukimeow/';

fs.readdir(imgDir, (err, files) => {
  if (err) {
    console.error('Ошибка чтения директории:', err);
    process.exit(1);
  }

  const filesWithTime = files
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => {
      const filePath = path.join(imgDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        mtime: stats.mtimeMs
      };
    });

  filesWithTime.sort((a, b) => b.mtime - a.mtime);

  const jsonResult = filesWithTime.map(fileObj => {
    const file = fileObj.name;
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
  console.log(`Успешно сгенерировано и отсортировано элементов: ${jsonResult.length}`);
});
