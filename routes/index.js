var express = require('express');
var router = express.Router();

const getJsonResponse = require("../models/fs");

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
 *       '404':
 *         description: Путь запрешен или не найден
 *       '500':
 *         description: Внутренняя ошибка сервера. Возвращается сообщение об ошибке
 */

router.get("/api/getPathInfo", async function(request, response){
    const path = request.query.path;

    try {
		let res = await getJsonResponse(path);
        if (res.error != undefined) {
            throw new accessError(res.res)
        }
        response.json(res);
    } catch (error) {
        if (error instanceof accessError) {
            response.status(404).json({ error: error.message })
        } else {
            console.error(error);
            response.status(500).json({ error: error.message });
        }
    }
});

/**
 * Класс ошибок для запрешенных и не найденых путей
 */
class accessError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = 404;
    }
}

module.exports = router;