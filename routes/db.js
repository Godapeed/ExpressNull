var express = require('express');
var router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());

const settings = require("C:/Users/Кирилл/Desktop/Стажировка/FSService/settings.json");
const fs = require('fs');
const path = require('path');

const {getPathInfo, getJsonResponse} = require("../models/fs");
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

const client3 = new Client({
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
                          size DOUBLE PRECISION,
                          created_at TIMESTAMP,
                          updated_at TIMESTAMP
                      );`);

    console.log("Таблица "+table_name+" успешно создана.");
  } catch (err) {
    console.error('Ошибка при создании таблицы:', err);
  }
}

async function getId(client, path) {
    try {
        const id = await client.query(`SELECT id FROM `+settings.tableName+` WHERE path='`+path+`'`);

        return id;
    } catch(err) {
        console.error("Ошибка получения id:" +err);
    }
}

async function insert(client, name, id_parent, path, isFolder, size, created, updated) {
    try {
        await client.query(`INSERT INTO `+settings.tableName+` (name, id_parent, path, folder, size, created_at, updated_at)
                            VALUES ('`+name+`', `+id_parent+`, '`+path+`', `+isFolder+`, `+size+`, 
                            '`+created+`', '`+updated+`');`);
    } catch(err) {
        console.error("Ошибка insert:" +err);
    }
}

async function getUpdate(client, id) {
  try {
      const updated = await client.query(`SELECT updated_at FROM `+settings.tableName+` WHERE id='`+id+`'`);
      const last_updated = updated.rows.map(row => row.updated_at)[0];

      const date1 = new Date(last_updated);
      const date2 = new Date(date1);
      date2.setHours(date2.getHours() + 3);

      const res_last_updated = date2.toISOString();

      return res_last_updated;
  } catch(err) {
      console.error("Ошибка получения id:" +err);
  }
}

async function updated(client, id, name, size, updated_at) {
  try {
      await client.query(`UPDATE public.file_info
                            SET 
                            name=`+name+`, 
                            size=`+size+`, 
                            updated_at=`+updated_at+`
                          WHERE id=`+id+`;`);

  } catch(err) {
      console.error("Ошибка обнавления информации в таблице:" +err);
  }
}

async function readDirRecursive(root, level, client, id_parent) {
  try {
    const files = fs.readdirSync(root);
  
    for (const file of files) {
      const fullPath = path.join(root, file);
      const stats = fs.statSync(fullPath);

      const info = await getPathInfo(fullPath, false, false, false);
      
      let all_id_of_path = await getId(client, info.path+"");
      let id = all_id_of_path.rows.map(row => row.id)[0];
      
      if (id === undefined) {
        await insert(client, info.name+"", id_parent, info.path+"", info.isFolder, info.size, info.created.toISOString(), info.updated.toISOString());
      } else {

        const last_updated = await getUpdate(client, id);
        
        if (last_updated !== info.updated.toISOString()) {
          await updated(client, id, info.name+"", info.size, info.updated.toISOString());
        }
      }

      all_id_of_path = await getId(client, info.path+"");
      id = all_id_of_path.rows.map(row => row.id)[0];

      if(stats.isDirectory()) {
        await readDirRecursive(fullPath, level + 1, client, id);
      }
    }
  } catch(err) {
    console.error('Ошибка при проверке обновлений:', err);
  }
}

async function main(client, client2, client3) {
  try {
    await client.connect();

    const databases = await getAllDatabases(client);
    console.log(databases);
    if (!checkElementExists(databases, settings.database)) {
      createDatabase(client, settings.database);
    }

    await client2.connect();

    const tables = await getAllTablesFromDB(client2);
    console.log(tables);
    if (!checkElementExists(tables, settings.tableName)) {
      createTable(client2, settings.tableName);
    }

    await client3.connect();

    await readDirRecursive(root, 0, client2, null);
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
    client2.end();
    client3.end();
  }
}

async function test(client) {
    try {
        client.connect();
        const info = await getJsonResponse("models/test/derectoris")
        const id = await getId(client, info.path+"");
        console.log(id)
    } catch(err) {
        console.error(err);
    } finally {
        client.end();
    }
}

//test(client2);
main(client, client2, client3);

router.get("/api/db", async function(request, response) {
    main(client);
});

module.exports = router;