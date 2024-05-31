const {createDatabase} = require("../db/createDatabase.js");
const {createTables} = require("../db/createTables.js");

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