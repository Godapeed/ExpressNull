const {createDatabase} = require("./createDatabase.js");
const {createTables} = require("./createTables.js");

/**
 * Функуия создания БД и ее наполнения
 */
async function createDataDatabase() {
    try {
        await createDatabase();
        await createTables();
    } catch (error) {
        console.error("Ошибка при созданиии БД и ее наполнения: " + error);
    }
}

module.exports = {createDataDatabase}