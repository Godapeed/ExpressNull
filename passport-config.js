const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Client } = require('pg');
const settings = require("./models/fs/settings.js");
const {getAllTablesFromDB, checkElementExists} = require("./models/db/db.js");

const client = new Client({
    user: settings.user,
    host: settings.host,
    database: settings.database,
    password: settings.password,
    port: settings.pgPort
});

client.connect();

async function createTable(client, table_name) {
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

async function main() {
    const tables = await getAllTablesFromDB(client);

    if (!checkElementExists(tables, settings.tableNameUsers)) {
        await createTable(client, settings.tableNameUsers);
    }
}

main();


passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const query = 'SELECT * FROM ' + settings.tableNameUsers + ' WHERE login = $1';
      const { rows } = await client.query(query, [username]);
      
      if (!rows.length) {
        return done(null, false);
      }

      const user = rows[0];
      if (user.password !== password) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));
