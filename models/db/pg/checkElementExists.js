/**
 * Функция проверки существования елемента в массиве
 * @param {*} array Массив в котором ищут
 * @param {*} element Элемент который ищут
 * @returns true - элемент найден, false - элемент не найден
 */
function checkElementExists(array, element) {
    return array.some(item => item.toLowerCase() === element.toLowerCase());
  }

module.exports = {checkElementExists}