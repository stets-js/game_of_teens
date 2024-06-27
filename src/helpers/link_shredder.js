const shortDomains = {
  'www.canva.com': 'canva',
  'canva.com': 'canva',
  'makecode.com': 'mkcd',
  'drive.google.com': 'Disk',
  'www.loom.com': 'loom',
  'loom.com': 'loom',
  'photos.app.goo.gl': 'Photo',
  'docs.google.com': 'Docs',
  's3.eu-north-1.amazonaws.com': 'file',
  'scratch.mit.edu': 'scratch'
};

const getDomainOrExtension = url => {
  // Парсинг URL
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    // Проверка на наличие расширения файла в конце URL
    const path = parsedUrl.pathname;
    const fileExtensionMatch = path.match(/\.\w+$/);
    if (fileExtensionMatch) {
      return fileExtensionMatch[0].slice(1); // Возвращаем расширение файла
    } else {
      return shortDomains[domain] || domain;
    }
  } catch (error) {
    console.log(url);
  }
};

module.exports = getDomainOrExtension;
