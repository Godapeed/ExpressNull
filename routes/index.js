var express = require('express');
var router = express.Router();

const {getJsonResponse, accessError} = require("../models/fs");

/**
 * @swagger
 * /:
 *   get:
 *     summary: Получение главной страницы
 *     description: Возвращает HTML страницу с заголовком "Главная страница"
 *     responses:
 *       '200':
 *         description: Успешный запрос, возвращает HTML страницу
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
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
            response.status(error.status).json({ message: error.message })
        } else {
            console.error(error);
            response.status(500).json({ error: error.message });
        }
    }
});

router.get("/api-json", function(req, res) {
    res.json(require('../swagger/swagger_output.json'));
});

module.exports = router;