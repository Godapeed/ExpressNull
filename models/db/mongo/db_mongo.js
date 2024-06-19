const { MongoClient } = require('mongodb');

// Подключение к MongoDB
const uri = 'mongodb://localhost:27017'; // URI для подключения к MongoDB
const client = new MongoClient(uri);

async function connectAndQuery() {
    try {
        await client.connect(); // Подключение к MongoDB
        const database = client.db('mydatabase'); // Выбор базы данных
        const collection = database.collection('mycollection'); // Выбор коллекции

        // Пример запроса
        const query = { name: 'Alice' };
        const result = await collection.find(query).toArray(); // Поиск документов

        console.log(result);
    } catch (error) {
        console.error('Ошибка:', error);
    } finally {
        await client.close(); // Закрытие соединения с MongoDB
    }
}

connectAndQuery();