// ПРИМЕР 4 — цепочка .then и обработка ошибок через .catch
// -------------------------------------------------
// Всё нативное, никакого интернета. fakeRequest() — это имитация fetch:
// возвращает промис; у "ответа" есть метод .json(), который тоже возвращает промис.
// Точно такая же форма, как у настоящего fetch в твоём chat.js.

const statusBox = document.querySelector('.status');
const answerBox = document.querySelector('.answer');
const breakBox = document.querySelector('.break');

function fakeRequest() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (breakBox.checked) {
                reject(new Error('сервер недоступен'));   // как будто пропал интернет
            } else {
                resolve({
                    json: function () {
                        return Promise.resolve({ text: 'Привет! Это ответ "сервера".' });
                    }
                });
            }
        }, 1000);
    });
}

function load() {
    statusBox.textContent = 'Загрузка...';
    answerBox.textContent = '';

    fakeRequest()
        .then(response => response.json())   // 1-й .then: распаковываем ответ (тоже промис)
        .then(data => {                      // 2-й .then: тут уже готовый объект
            statusBox.textContent = '';
            answerBox.textContent = data.text;
        })
        .catch(error => {
            // ДОПИШИ ЗДЕСЬ три строки:
            // 1) answerBox.textContent = 'Ошибка загрузки';
            // 2) statusBox.textContent = '';
            // 3) console.log(error);

        });
}

document.querySelector('.load-btn').addEventListener('click', load);


// -------------------------------------------------
// Проверка:
// 1) нажми "Запросить" без галочки — через секунду появится ответ (два .then сработали);
// 2) поставь галочку "сломать ответ", нажми снова:
//      - пока .catch пустой -> "Загрузка..." так и висит (reject поймали, но ничего не сделали);
//      - когда допишешь три строки -> "Загрузка..." пропадает, появляется "Ошибка загрузки".
// 3) хочешь увидеть настоящую красную ошибку "Uncaught (in promise)"?
//    закомментируй ВЕСЬ .catch(...) целиком и повтори с галочкой.
