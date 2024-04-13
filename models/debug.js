//Файл для отладки
const {getJsonResponse, accessError} = require("../models/fs");

async function main() {
    try {
      const c = await getJsonResponse("models/test/derectoris/about")
      console.log(c);
      return c;
    } catch (err) {}
  }
  
console.log(main())