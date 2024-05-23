const fs = require("fs");
const settingsData = fs.readFileSync("C:/Users/Кирилл/Desktop/Стажировка/FSService/settings.json");
const settings = JSON.parse(settingsData);

require('dotenv').config()

for (const key in process.env) {
    if (key.startsWith("FSS_")) {
        const envKey = key.substring(4).toLowerCase().replace(/_(.)/g, (match, char) => char.toUpperCase()); // Убираем префикс "FSS_" и преобразуем остальную переменную под мид в settings
        
        settings[envKey] = process.env[key];
    }
}

module.exports = settings;