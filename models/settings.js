const fs = require("fs");
const settingsData = fs.readFileSync("C:/Users/Кирилл/Desktop/Стажировка/FSService/settings.json");
const settings = JSON.parse(settingsData);

module.exports = settings;