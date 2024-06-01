const settings = require("../../fs/settings.js");
const client = require("./client.js")

async function verifyCallback(username, password, done) {
  try {
    const { rows } = await client.query(`SELECT * FROM ${settings.tableNameUsers} WHERE login = '${username}'`);

    if (rows.length === 0) {
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
};

module.exports = {verifyCallback};