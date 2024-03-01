var express = require('express');
var router = express.Router();

const {getJsonResponse, accessError} = require("../models/fs");

router.get("/", function(request, response){
     
    response.send("<h1>Главная страница</h1>");
});
router.get("/about", function(request, response){
     
    response.send("<h1>О сайте</h1>");
});
router.get("/contact", function(request, response){
     
    response.send("<h1>Контакты</h1>");
});

router.get("/api/getPathInfo", async function(request, response){
    const path = request.query.path;

    try {
		let res = await getJsonResponse(path);
        response.json(res);
    } catch (error) {
        if (error instanceof accessError) {
            response.json("400: " + error.message)
        } else {
            console.error(error);
            response.status(error.status).json({ error: error.message });
        }
    }
});

module.exports = router;