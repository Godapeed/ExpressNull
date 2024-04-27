const checkPath = require("./checkPath");
const settings = require("./settings");

const fs = require("fs");
const path = require("path");

const defaultPath = settings.defaultPath;
/**
 * Функция получения информацию о файле в виде объекта
 * @param {*} filepath Путь к файлу
 * @param {*} onlyFolders Флаг возвращать ли в детях файла вернуть только директории
 * @param {*} onlyFiles Флаг возвращать ли в детях файла вернуть только файлы 
 * @param {*} Children Флаг возврашать ли детей файла
 * @returns Обыект содержащий {путь к файлу, имя файла, статус директория/файл, размер файла, дата и время создания, дата и время последнего изменения}
 */
async function getPathInfo(filepath, onlyFolders = false, onlyFiles = false, Children = true) {
  try {
    // Используем fs.promises.stat для получения статистики файла по указанному пути
    const stats = await fs.promises.stat(filepath);
      
    const info = {
      path: filepath,
      name: path.basename(filepath),
      isFolder: stats.isDirectory(),
      size: stats.size,
      created: stats.birthtime,
      updated: stats.mtime,
    };
      
    if (stats.isDirectory() && !(onlyFolders && onlyFiles)) {
      // Асинхронно получаем список файлов в указанном каталоге
      const files = await fs.promises.readdir(filepath);
          
      // Асинхронно получаем статистику каждого файла в массиве files
      const fileStats = await Promise.all(
        files.map((file) => fs.promises.stat(path.join(filepath, file)))
      );

      if (onlyFiles) {
        // Фильтруем список files, оставляя только файлы (не директории)
        files = files.filter((file, index) => !fileStats[index].isDirectory());
      } else if (onlyFolders) {
        // Фильтруем список files, оставляя только директории
        files = files.filter((file, index) => fileStats[index].isDirectory());
      }

      //Формирование масива с информацией о детях файла
      if (Children == true) {
        const childrenInfo = [];
        for (const file of files) {
          const absolutePath = path.join(filepath, file);
          if (checkPath(absolutePath.replace(/\\/g, '/')) === "Путь разрешен") {
            //Формирование информации о ребенке
            const childInfo = await getPathInfo(absolutePath, false, false, false);
            childrenInfo.push(childInfo);
          }
        }
      
        info.children = childrenInfo;
      }
    }

    return info;
  } catch (err) {
    throw err;
  }
}
/**
 * Функция получения ответа в формате json
 * @param {*} filepath Путь к файлу
 * @param {*} onlyFolders Флаг возвращать ли в детях файла вернуть только директории
 * @param {*} onlyFiles Флаг возвращать ли в детях файла вернуть только файлы 
 * @returns Обыект содержащий {путь к файлу, имя файла, статус директория/файл, размер файла, дата и время создания, дата и время последнего изменения}
 */
async function getJsonResponse(directoryPath, onlyFolders = false, onlyFiles = false) {
  //Проверка пустой ли путь к файлу, если да, то выбор стандартного пути из настроек
  if (directoryPath === "") {
    directoryPath = defaultPath;
  }
  //Приведение путя к фалу к абсолютному пути и "причесывание его"
  directoryPath = path.resolve(directoryPath).replace(/\\/g, '/').replace(/\/\//g, '/');

    let res = checkPath(directoryPath)
    switch (res) {
      case "Путь не найден":
        return {error: "Путь не найден", res: res}
      case "Путь запрешен":
        return {error: "Путь запрешен", res: res}
      case "Путь разрешен":
        return await getPathInfo(directoryPath, onlyFolders, onlyFiles);
    }
}

module.exports = {getJsonResponse, getPathInfo};