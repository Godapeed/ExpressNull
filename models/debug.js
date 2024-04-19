//Файл для отладки
const {getJsonResponse, accessError} = require("../models/fs");
const checkPath = require("../models/checkPath")
const path = "models/test/derectoris/products/category/category1"

async function main() {
    try {
      const c = await getJsonResponse(path)
      console.log(c);
      if(c.error != undefined){ console.log("123")}
      return c;
    } catch (error) {
      if (error instanceof accessError) {
        console.error(error);
    } else {
      console.error(error);
  }
    }
  }
  
console.log(main())
//console.log(checkPath(path))