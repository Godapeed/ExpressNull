const checkPath = require("./checkPath");
const settings = require("./settings");

const fs = require("fs");
const path = require("path");

const defaultPath = settings.defaultPath;
/**
 * 
 * @param {*} filepath 
 * @param {*} onlyFolders 
 * @param {*} onlyFiles 
 * @returns 
 */
async function getPathInfo(filepath, onlyFolders = false, onlyFiles = false, Children = true) {
  try {
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
      const files = await fs.promises.readdir(filepath);
          
      const fileStats = await Promise.all(
        files.map((file) => fs.promises.stat(path.join(filepath, file)))
      );

      if (onlyFiles) {
        files = files.filter((file, index) => !fileStats[index].isDirectory());
      } else if (onlyFolders) {
        files = files.filter((file, index) => fileStats[index].isDirectory());
      }

      if (Children == true) {
        const childrenInfo = [];
        for (const file of files) {
          const absolutePath = path.join(filepath, file);
          if (checkPath(absolutePath.replace(/\\/g, '/')) === "Путь разрешен") {
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

async function getJsonResponse(directoryPath, onlyFolders = false, onlyFiles = false) {
  if (directoryPath === "") {
    directoryPath = defaultPath;
  }
  directoryPath = path.resolve(directoryPath).replace(/\\/g, '/').replace(/\/\//g, '/');

    let res = checkPath(directoryPath)
    switch (res) {
      case "Путь не найден":
        throw new accessError(res);
      case "Путь запрешен":
        throw new accessError(res);
      case "Путь разрешен":
        return await getPathInfo(directoryPath, onlyFolders, onlyFiles);
    }
}

class accessError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 400;
  }
}

async function main() {
  try {
    const c = await getJsonResponse("")
    console.log(c);
    return c;
  } catch (err) {}
}

//console.log(main())

module.exports = {getJsonResponse, accessError};