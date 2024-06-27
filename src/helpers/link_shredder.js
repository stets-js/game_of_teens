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
      return domain; // Возвращаем домен
    }
  } catch (error) {
    console.log(url);
  }
};

module.exports = getDomainOrExtension;
