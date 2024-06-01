const settings = require("../../fs/settings.js");

const { Client } = require('pg');

function createClient() {
    return new Client({
        user: settings.user,
        host: settings.host,
        database: settings.database,
        password: settings.password,
        port: settings.pgPort
    });
}

module.exports = {
    query: async function(queryText) {
        const client = createClient();
        await client.connect();
        const result = await client.query(queryText);
        await client.end();
        return result;
    }
};