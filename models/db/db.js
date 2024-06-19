const settings = require("../fs/settings.js");

const {localStorageMirroring} = require("./sequelize/sequelize.js");

function db() {
    if (settings.dialect != "mongo") {
        localStorageMirroring();
    } else {
        mongo();
    }
};

module.exports = {db};