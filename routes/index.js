var express = require('express');
var router = express.Router();

const {getJsonResponse, accessError} = require("../models/fs");

/**
 * @swagger
 * /api/getPathInfo:
 *   get:
 *     summary: Получить информацию по указанному пути
 *     description: Возвращает информацию по указанному пути в формате JSON
 *     parameters:
 *       - in: query
 *         name: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Путь, для которого необходимо получить информацию
 *     responses:
 *       '200':
 *         description: Успешное получение информации. Возвращает запрошенную информацию
 *       '400':
 *         description: Некорректный запрос. Возвращается сообщение об ошибке
 *       '500':
 *         description: Внутренняя ошибка сервера. Возвращается сообщение об ошибке
 */

router.get("/api/getPathInfo", async function(request, response){
    const path = request.query.path;

    try {
		let res = await getJsonResponse(path);
        response.json(res);
    } catch (error) {
        console.log("dsdsd")
        if (error instanceof accessError) {//избравить
            response.status(error.status).json({ message: error.message })
        } else {
            console.error(error);
            response.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;