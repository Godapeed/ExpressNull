const settings = require("../../fs/settings.js");
const {checkElementExists} = require("./checkElementExists.js");
const client = require("./client.js")

/**
 * Функция создания таблицы users
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} table_name Название таблицы 
 */
async function createTableUsers(client, table_name) {
    try {
      await client.query(`CREATE TABLE IF NOT EXISTS `+table_name+` (
                            id SERIAL PRIMARY KEY,
                            login VARCHAR(255) NOT NULL,
                            password VARCHAR(255) NOT NULL,
                            id_role INTEGER
                        );`);
  
      console.log("Таблица "+table_name+" успешно создана.");
    } catch (err) {
      console.error('Ошибка при создании таблицы:', err);
    }
}

/**
 * Функция вставки стандартного пользователя admin с паролем admin
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} table_name Название таблицы 
 */
async function insertTableUsers(client, table_name) {
    try {
        await client.query(`INSERT INTO `+table_name+`(login, password)
                            VALUES ('admin', 'admin');`)
    } catch (err) {
        console.error('Ошибка вставке нулевого администратора:', err);
    }
}

/**
 * Функция создания таблицы file_info
 * @param {*} client Клиент по которому происходит взаимодействие с БД
 * @param {*} table_name Название таблицы
 */
async function createTableFileInfo(client, table_name) {
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
 * Функуия создания табиц в БД если это необходимо
 */
async function createTables() {
    try {
        const tables = await getAllTablesFromDB(client);

        if (!checkElementExists(tables, settings.tableNameUsers)) {
            await createTableUsers(client, settings.tableNameUsers);
            await insertTableUsers(client, settings.tableNameUsers);
        };
    
        tables = await getAllTablesFromDB(client);

        if (!checkElementExists(tables, settings.tableName)) {
            await createTableFileInfo(client, settings.tableNameFileInfo);
        }
    } catch(error) {
        console.error("Ошибка при создании таблиц: " + error);
    }
}

module.exports = {createTables, client}