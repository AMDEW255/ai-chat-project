// ПРИМЕР 1 — почему вообще нужен асинхронный код
// -------------------------------------------------
// Тут ничего дописывать не надо. Открой index.html, понажимай кнопки и понаблюдай.

const clock = document.querySelector('.clock');
const result = document.querySelector('.result');

// Часы тикают каждые 100 мс. Если браузер "зависнет" — часы встанут.
setInterval(function () {
    const now = new Date();
    clock.textContent =
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');
}, 100);


// ПЛОХО: синхронный код.
// Браузер застревает в этом цикле на 3 секунды и не может делать НИЧЕГО:
// часы стоят, в поле не напечатать, кнопки не нажать.
function freezeBad() {
    // Сюда специально НЕ пишем "морожу..." — эта надпись всё равно не появилась бы:
    // строчкой ниже поток встанет на 3 секунды, и браузер не успеет перерисовать страницу.
    // Пока идёт цикл — просто смотри на часы и пробуй печатать в поле.

    const end = Date.now() + 3000;
    while (Date.now() < end) {
        // пустой цикл — просто занимаем процессор на 3 секунды
    }

    result.textContent = 'Отпустило. Часы сейчас "прыгнут" вперёд — они всё это время стояли.';
}


// ХОРОШО: асинхронный код.
// setTimeout откладывает работу на потом, а эти 3 секунды браузер свободен:
// часы идут, в поле можно печатать.
function waitGood() {
    result.textContent = 'Жду 3 секунды через setTimeout... печатай, смотри на часы — всё работает';

    setTimeout(function () {
        result.textContent = 'Готово. Часы не останавливались, печатать было можно.';
    }, 3000);
}


document.querySelector('.freeze-btn').addEventListener('click', freezeBad);
document.querySelector('.wait-btn').addEventListener('click', waitGood);
