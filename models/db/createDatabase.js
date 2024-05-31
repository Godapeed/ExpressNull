const settings = require("C:/Users/Кирилл/Desktop/Стажировка/FSService/settings.json");
const {checkElementExists} = require("../db/checkElementExists.js");

const { Client } = require('pg');

//Клиент необходимы для проверки существования нужной БД
const client = new Client({
    user: settings.user,
    host: settings.host,
    database: '',
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
 * Функция создания БД
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} dbName Название БД
 */
async function createDatabaseFSS(client, dbName) {
    try {
        await client.query("CREATE DATABASE "+dbName);
  
        console.log("База данных "+dbName+" успешно создана.");
    } catch (err) {
        console.error('Ошибка при создании базы данных FSS:', err);
    }
  };
/**
 * Функция создания БД если это необходимо
 */
async function createDatabase() {
    try {
      await client.connect();
  
      const databases = await getAllDatabases(client);

      if (!checkElementExists(databases, settings.database)) {
        await createDatabaseFSS(client, settings.database);
      }
    } catch (error) {
      console.error("Ошибка при создании БД: " + error);
    } finally {
      client.end();
    }
}

module.exports = {createDatabase}