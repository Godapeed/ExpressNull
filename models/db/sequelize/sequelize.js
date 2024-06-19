const { Sequelize, DataTypes } = require('sequelize');
const settings = require("../../fs/settings.js");

const {getPathInfo, getJsonResponse} = require("../../fs/fs");
const root = settings.root;

const sequelize = new Sequelize({
  dialect: settings.dialect,
  database: settings.database,
  username: settings.user,
  password: settings.password,
  host: settings.host,
  port: settings.pgPort
});

const FileInfo = sequelize.define('file_info', {
  name: {
    type: DataTypes.STRING
  },
  id_parent: {
    type: DataTypes.INTEGER
  },
  path: {
    type: DataTypes.STRING
  },
  folder: {
    type: DataTypes.BOOLEAN
  },
  size: {
    type: DataTypes.INTEGER
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  },
  delete: {
    type: DataTypes.BOOLEAN
  }
});

sequelize.sync();

async function getId(path) {
  try {
    const fileInfo = await FileInfo.findOne({
      attributes: ['id'],
      where: {
        path: path
      }
    });
    return fileInfo.id;
  } catch(err) {
    console.error("Ошибка получения id: " + err);
  }
}

async function insert(name, id_parent, path, folder, size, created_at, updated_at) {
  try {
    await FileInfo.create({
      name: name,
      id_parent: id_parent,
      path: path,
      folder: folder,
      size: size,
      created_at: created_at,
      updated_at: updated_at,
      delete: false
    });
  } catch(err) {
    console.error("Ошибка вставки: " + err);
  }
}

async function updateInfo(id, name, size, updated_at) {
  try {
    await FileInfo.update(
      {
        name: name,
        size: size,
        updated_at: updated_at
      },
      {
        where: {
          id: id
        }
      }
    );
  } catch(err) {
    console.error("Ошибка обновления информации в таблице: " + err);
  }
}

async function updateDelete(ids) {
  try {
    await FileInfo.update(
      { delete: true },
      {
        where: {
          id: { [Sequelize.Op.notIn]: ids }
        }
      }
    );
  } catch(err) {
    console.error("Ошибка обновления информации об удаленных путях в таблице: " + err);
  }
}

const fs = require('fs');
const path = require('path');

async function readDirRecursive(root, level, id_parent, ids = []) {
  try {
    const files = fs.readdirSync(root);
  
    for (const file of files) {
      const fullPath = path.join(root, file);
      const stats = fs.statSync(fullPath);

      const info = await getPathInfo(fullPath, false, false, false);
      
      let id = await getId(info.path);

      if (id === undefined) {
        await insert(info.name, id_parent, info.path, info.isFolder, info.size, info.created.toISOString(), info.updated.toISOString());
        const newId = await getId(info.path);
        ids.push(newId);
      } else {
        ids.push(id);
        const lastUpdated = await getInfo(id);
        if (new Date(lastUpdated.updated_at).getTime() !== new Date(info.updated.toISOString()).getTime()) {
          await updateInfo(id, info.name, info.size, info.updated.toISOString());
        }
      }

      id = await getId(info.path);

      if(stats.isDirectory()) {
        await readDirRecursive(fullPath, level + 1, id, ids);
      }
    }
    return ids;
  } catch(err) {
    console.error('Error while checking updates:', err);
  }
}

async function localStorageMirroring() {
  try {
    // Рекурсивно проходим все элементы и дублируем их в БД
    const ids = await readDirRecursive(root, 0, null);
    await updateDelete(ids);
  } catch (error) {
    console.error(error);
  }
}

localStorageMirroring();

module.exports = {localStorageMirroring}
