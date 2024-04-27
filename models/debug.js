//Файл для отладки
const {getJsonResponse, accessError} = require("../models/fs");
const checkPath = require("../models/checkPath")
const paths = "models/test/derectoris/products/category/category1"
const settings = require("./settings");
const fs = require('fs');
const path = require('path');

/*async function main() {
    try {
      const c = await getJsonResponse(path)
      console.log(c);
      if(c.error != undefined){ console.log("123")}
      return c;
    } catch (error) {
      if (error instanceof accessError) {
        console.error(error);
    } else {
      console.error(error);
  }
    }
  }
  
console.log(main())
//console.log(checkPath(path))*/

const {getPathInfo} = require("../models/fs");
const root = settings.root;

const {Client} = require('pg');

const client = new Client({
    user: settings.user,
    host: settings.host,
    database: '',
    password: settings.password,
    port: settings.pgPort
});

const client2 = new Client({
  user: settings.user,
  host: settings.host,
  database: settings.database,
  password: settings.password,
  port: settings.pgPort
});

async function getAllDatabases(client) {
  try {
      const res = await client.query('SELECT datname FROM pg_database');

      const databaseArray = res.rows.map(row => row.datname);
      return databaseArray;
  } catch (err) {
      console.error("Error retrieving list of databases: "+err);
  }
};

function checkElementExists(array, element) {
  return array.some(item => item.toLowerCase() === element.toLowerCase());
}

async function createDatabase(client, dbName) {
  try {
      await client.query("CREATE DATABASE "+dbName);

      console.log("База данных "+dbName+" успешно создана.");
  } catch (err) {
      console.error('Ошибка при создании базы данных:', err);
  }
}

async function getAllTablesFromDB(client) {

  try {
      const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");
      const tables = res.rows.map(row => row.table_name);
      return tables;
  } catch (error) {
      console.error(error);
  }
}

async function createTable(client, table_name) {
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS `+table_name+` (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          id_parent INTEGER,
                          path TEXT,
                          folder BOOLEAN,
                          size FLOAT,
                          created_at TIMESTAMP,
                          updated_at TIMESTAMP
                      );`);

    console.log("Таблица "+table_name+" успешно создана.");
  } catch (err) {
    console.error('Ошибка при создании таблицы:', err);
  }
}

async function readDirRecursive(dir, level, client, id_parent = null) {
  try {
    const files = fs.readdirSync(dir);
  
    files.forEach(async file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        const info = await getPathInfo(fullPath, false, false, false);
        //console.log(info);
        const id = await client.query(`SELECT id FROM `+settings.tableName+` WHERE path = `+info.path+`;`);

        if (id === undefined) {
          await client.query(`INSERT INTO fileinfo (name, id_parent, path, folder, size, created_at, updated_at)
                              VALUES (`+info.name+`, `+id_parent+`, `+info.path+`, `+info.isFolder+`, `+info.size+`, 
                              `+info.created+`, `+info.updated+`);`);
        }

        if(stats.isDirectory()) {
            readDirRecursive(fullPath, level + 1, client, id);
        }
    });
  } catch {
    console.error('Ошибка при проверке обновлений:', err);
  }
}

async function main(client) {
  try {
    client.connect();
    client2.connect();

    const databases = await getAllDatabases(client);
    console.log(databases);
    if (!checkElementExists(databases, settings.database)) {
      createDatabase(client, settings.database);
    }
    client.end();

    const tables = await getAllTablesFromDB(client2);
    console.log(tables);
    if (!checkElementExists(tables, settings.tableName)) {
      createTable(client2, settings.tableName);
    }

    readDirRecursive(root, 0, client2);
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
    client2.end();
  }
}

main(client)