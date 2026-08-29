// ПРИМЕР 5 — тот же запрос, но через async / await
// -------------------------------------------------
// Сравни этот файл с example4_fetch/script.js — код делает ТО ЖЕ САМОЕ,
// только читается сверху вниз, как обычный рассказ.

const statusBox = document.querySelector('.status');
const answerBox = document.querySelector('.answer');
const breakBox = document.querySelector('.break');

// та же имитация запроса, что и в примере 4 (нативный JS, без интернета)
function fakeRequest() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (breakBox.checked) {
                reject(new Error('сервер недоступен'));
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

async function load() {
    statusBox.textContent = 'Загрузка...';
    answerBox.textContent = '';

    try {
        const response = await fakeRequest();     // ждём "ответ"
        const data = await response.json();       // ждём распаковку
        answerBox.textContent = data.text;
        statusBox.textContent = '';               // <-- строчка 1 (после успеха)
    } catch (error) {
        answerBox.textContent = 'Ошибка загрузки';
        statusBox.textContent = '';               // <-- строчка 2 (после ошибки) — ДУБЛЬ
        console.log(error);
    }

    // ЗАДАНИЕ: убери строчку 1 и строчку 2, а закрывающую } у catch замени на:
    //   } finally {
    //       statusBox.textContent = '';   // выполнится в любом случае
    //   }
    // (то есть блоков становится три: try { } catch (error) { } finally { })
}

document.querySelector('.load-btn').addEventListener('click', load);
