const fs = require("fs");
const settingsData = fs.readFileSync("C:/Users/Кирилл/Desktop/Стажировка/FSService/settings.json");
const settings = JSON.parse(settingsData);

/*require('dotenv').config()

for (const key in process.env) {
    if (key.startsWith("FSS_")) {
        const envKey = key.substring(4); // Убираем префикс "FSS_"
        settings[envKey] = process.env[key];
    }
}*/

module.exports = settings;