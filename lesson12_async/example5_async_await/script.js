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
        statusBox.textContent = '';               // <-- ЭТА строка (прячем "Загрузка..." после успеха)
    } catch (error) {
        answerBox.textContent = 'Ошибка загрузки';
        statusBox.textContent = '';               // <-- И ЭТА — точно такая же (после ошибки). Дублируем!
        console.log(error);
    }

    // ЗАДАНИЕ: обе строки  statusBox.textContent = ''  (в try и в catch, помечены выше)
    // делают одно и то же. Убери их обе, а закрывающую } у catch замени на блок finally.
    // Было:                        Стало:
    //   } catch (error) {            } catch (error) {
    //       ...                          ...
    //   }                            } finally {
    //                                    statusBox.textContent = '';   // сработает в любом случае
    //                                }
}

document.querySelector('.load-btn').addEventListener('click', load);
