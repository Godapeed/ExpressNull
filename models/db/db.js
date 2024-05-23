const settings = require("C:/Users/Кирилл/Desktop/Стажировка/FSService/settings.json");
const fs = require('fs');
const path = require('path');

const {getPathInfo, getJsonResponse} = require("../fs/fs");
const root = settings.root;

const {Client} = require('pg');

//Клиент необходимы для проверки существования нужной БД
const client = new Client({
    user: settings.user,
    host: settings.host,
    database: '',
    password: settings.password,
    port: settings.pgPort
});
//Клиент необходимый для подключения к БД
const client2 = new Client({
  user: settings.user,
  host: settings.host,
  database: settings.database,
  password: settings.password,
  port: settings.pgPort
});
/**
 * Функция получения массива сушествуюших БД
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @returns Массив всех БД на сервере pssql
 */
async function getAllDatabases(client) {
  try {
      const res = await client.query('SELECT datname FROM pg_database');

      const databaseArray = res.rows.map(row => row.datname);
      return databaseArray;
  } catch (err) {
      console.error("Ошибка при извлечении списка базданных: "+err);
  }
};
/**
 * Функция проверки существования елемента в массиве
 * @param {*} array Массив в котором ищут
 * @param {*} element Элемент который ищут
 * @returns true - элемент найден, false - элемент не найден
 */
function checkElementExists(array, element) {
  return array.some(item => item.toLowerCase() === element.toLowerCase());
}
/**
 * Функция создания БД
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} dbName Название БД
 */
async function createDatabase(client, dbName) {
  try {
      await client.query("CREATE DATABASE "+dbName);

      console.log("База данных "+dbName+" успешно создана.");
  } catch (err) {
      console.error('Ошибка при создании базы данных:', err);
  }
}
/**
 * Функция получения массива существующих таблиц
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @returns Массива существующих таблиц
 */
async function getAllTablesFromDB(client) {

  try {
      const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");
      const tables = res.rows.map(row => row.table_name);
      return tables;
  } catch (error) {
      console.error(error);
  }
}
/**
 * Функция создания таблицы
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} table_name Название таблицы
 */
async function createTable(client, table_name) {
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS `+table_name+` (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          id_parent INTEGER,
                          path TEXT,
                          folder BOOLEAN,
                          size DOUBLE PRECISION,
                          created_at TIMESTAMP with time zone,
                          updated_at TIMESTAMP with time zone,
                          delete BOOLEAN
                      );`);

    console.log("Таблица "+table_name+" успешно создана.");
  } catch (err) {
    console.error('Ошибка при создании таблицы:', err);
  }
}
/**
 * Функция получения id используя path
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} path Путь
 * @returns id которое соответсвует path
 */
async function getId(client, path) {
    try {
        const id = await client.query(`SELECT id FROM `+settings.tableName+` WHERE path='`+path+`'`);

        return id;
    } catch(err) {
        console.error("Ошибка получения id:" +err);
    }
}
/**
 * Функция вставки нового элемента в таблицу
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} name Название элемента
 * @param {*} id_parent id более высокого в дереве путей элемента на один уровень
 * @param {*} path Путь к элементу на локальном хранилище данных
 * @param {*} isFolder Флаг отвечающий за то, являеться ли элемент папкой (true - да, false - нет)
 * @param {*} size Размер элемента
 * @param {*} created Дата создания элемента
 * @param {*} updated Дата последнего изменения элемента
 */
async function insert(client, name, id_parent, path, isFolder, size, created, updated) {
    try {
        await client.query(`INSERT INTO `+settings.tableName+` (name, id_parent, path, folder, size, created_at, updated_at, delete)
                            VALUES ('`+name+`', `+id_parent+`, '`+path+`', `+isFolder+`, `+size+`, 
                            '`+created+`', '`+updated+`', false);`);
    } catch(err) {
        console.error("Ошибка insert:" +err);
    }
}
/**
 * Функция обновления информации об элементе, если она поменялась
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} id id элемента
 * @param {*} name Название элемента
 * @param {*} size Размер элемента
 * @param {*} updated_at Дата последнего обновления элемента
 */
async function updated_info(client, id, name, size, updated_at) {
  try {
      await client.query(`UPDATE `+settings.tableName+`
                            SET 
                            name='`+name+`', 
                            size=`+size+`, 
                            updated_at='`+updated_at+`'
                          WHERE id=`+id+`;`);

  } catch(err) {
      console.error("Ошибка обнавления информации в таблице:" +err);
  }
}
/**
 * Функция обновления информации об элементе, если он был удален с локального хранилища
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} ids Массив ids которые остались на локальном хранилище
 */
async function updated_delete(client, ids) {
  try {
    await client.query(`UPDATE `+settings.tableName+`
                    SET 
                    delete=`+true+`
                  WHERE id NOT IN `+ids+`;`);
  } catch(err) {
    console.error("Ошибка обнавления информации об удаленных путях в таблице:" +err);
  }
}
/**
 * Функция рекурсивного чтения всех элементов находящихся на локальном хранилище
 * @param {*} root Кореневая директория для хранения элементов
 * @param {*} level Уровень вложености в рекурсивной функции
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} id_parent id элемента в котором храниться данный элемент
 * @param {*} ids Массив всех id элементов по которым прошлась функция
 * @returns ids
 */
async function readDirRecursive(root, level, client, id_parent, ids = []) {
  try {
    const files = fs.readdirSync(root);
  
    for (const file of files) {
      const fullPath = path.join(root, file);
      const stats = fs.statSync(fullPath);

      const info = await getPathInfo(fullPath, false, false, false);
      
      let all_id_of_path = await getId(client, info.path+"");
      let id = all_id_of_path.rows.map(row => row.id)[0];
      
      if (id === undefined) {
        await insert(client, info.name+"", id_parent, info.path+"", info.isFolder, info.size, info.created.toISOString(), info.updated.toISOString(), false);
        const id = await client.query(`SELECT id FROM `+settings.tableName+` WHERE path='`+info.path+`'`);
        ids.push(id);
      } else {
        ids.push(id);
        const updated = await client.query(`SELECT updated_at FROM `+settings.tableName+` WHERE id='`+id+`'`);
        const last_updated = updated.rows.map(row => row.updated_at)[0];
        if (new Date(last_updated).getTime() !== new Date(info.updated.toISOString()).getTime()) {
          await updated_info(client, id, info.name+"", info.size, info.updated.toISOString());
        }
      }

      all_id_of_path = await getId(client, info.path+"");
      id = all_id_of_path.rows.map(row => row.id)[0];

      if(stats.isDirectory()) {
        await readDirRecursive(fullPath, level + 1, client, id, ids);
      }
    }
    return ids;
  } catch(err) {
    console.error('Ошибка при проверке обновлений:', err);
  }
}
/**
 * Функуия проверки наличия БД, таблицы. Дублирование элементов хранящихся на локальном хранилище в БД
 * @param {*} client Клиент необходимы для проверки существования нужной БД
 * @param {*} client2 Клиент по которому происходит взаимодействие с БД
 */
async function main(client, client2) {
  try {
    //Проверка наличия БД
    await client.connect();

    const databases = await getAllDatabases(client);
    //console.log(databases);
    if (!checkElementExists(databases, settings.database)) {
      await createDatabase(client, settings.database);
    }
    
    //Проверка наличия таблицы
    await client2.connect();

    const tables = await getAllTablesFromDB(client2);
    //console.log(tables);
    if (!checkElementExists(tables, settings.tableName)) {
      await createTable(client2, settings.tableName);
    }

    //Рекурсивный проход всех элементов и дублирование элементов в БД
    var ids = await readDirRecursive(root, 0, client2, null);
    ids = '(' + ids + ')';
    await updated_delete(client2, ids);
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
    client2.end();
  }
}

main(client, client2);

module.exports = {main, getAllTablesFromDB, checkElementExists}