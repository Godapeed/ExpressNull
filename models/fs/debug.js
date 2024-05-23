//Файл для отладки
/*const {getJsonResponse, accessError} = require("../fs/fs");
const checkPath = require("../fs/checkPath")
const paths = "models/test/derectoris"
const settings = require("./settings");
const fs = require('fs');
const path = require('path');

async function main() {
    try {
      const c = await getJsonResponse(paths)
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
  
//console.log(main())
//console.log(checkPath(path))

const {Client} = require('pg');

const client = new Client({
  user: settings.user,
  host: settings.host,
  database: settings.database,
  password: settings.password,
  port: settings.pgPort
});

async function test(client) {
  try {
      client.connect();

      const x = await client.query(`SELECT id, name, id_parent, path, folder, size, created_at, updated_at FROM public.fileinfo;`)
      console.log(x);
  } catch(err) {
      console.error(err);
  } finally {
      client.end();
  }
}

//test(client)*/
let ids = [1, 2, 3]
const placeholders = ids.map((id, index) => (index+1)).join(', ');
    console.log("${placeholders}")