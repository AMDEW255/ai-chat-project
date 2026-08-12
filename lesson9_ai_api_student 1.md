# Урок 9 — Своя нейросеть-помощник (Groq API, бесплатно)

Сегодня делаем свою мини-страничку с чатом к настоящей нейросети.

---

## Шаг 0 — почта и свой GitHub

Прежде чем начать — тебе нужен свой аккаунт, отдельно от того что использует наставник:

1. Если ещё нет своей электронной почты — заведи её (например, на [gmail.com](https://gmail.com))
2. Зайди на [github.com](https://github.com) и зарегистрируйся, используя эту почту — придумай логин и пароль
3. Запомни или сохрани логин и пароль — они понадобятся, если захочешь потом сохранить свой проект на GitHub

---

## Шаг 0.1 — получаем ключ (сделает наставник)

Ключ доступа к нейросети тебе выдаст [твой ментор/учитель]. Это как пароль — **никому его не показывай и никогда не выкладывай в интернет**, даже случайно.

---

## Шаг 1 — новый проект и секретный файл

1. Создай новую папку для этого проекта — назови её, например, `ai-chat-project`. Это отдельный проект, не трогаем в нём калькулятор или трекер
2. Внутри неё создай новый файл с именем `config.js` — точно так же, как раньше создавала `script.js` или `render.js`
3. Впиши туда одну строку:

```js
const API_KEY = "вставь_сюда_ключ_который_тебе_дали";
```

4. Вместо `вставь_сюда_ключ_который_тебе_дали` вставь ключ, который тебе передали (с кавычками вокруг него, кавычки не убирай)
5. Сохрани файл (Ctrl+S)
6. В той же папке создай ещё один файл с именем `.gitignore` (да, имя начинается с точки, и больше в имени ничего нет)
7. Впиши туда одну строку:

```
config.js
```

8. Сохрани файл (Ctrl+S)

Это делает файл `config.js` секретным: когда будешь сохранять проект в общее хранилище (GitHub), этот файл туда не попадёт. Ключ останется только у тебя на компьютере, и никто чужой его не увидит.

---

## Если Groq не заработает (запасной вариант — DeepSeek)

Открой в браузере [console.groq.com](https://console.groq.com) без VPN. Если сайт не открывается или запрос из Шага 3 не проходит — попроси у наставника ключ от DeepSeek вместо Groq и поменяй в `config.js` и `chat.js` две вещи:

1. Адрес: `https://api.groq.com/openai/v1/chat/completions` → `https://api.deepseek.com/chat/completions`
2. Модель: `"llama-3.3-70b-versatile"` → `"deepseek-v4-flash"`

Остальной код (fetch, headers, chat.js) не меняется — оба провайдера работают одинаково.

DeepSeek иногда может ответить на китайском, если сам "решит" переключить язык. Чтобы этого не было, добавь системное сообщение первым в массив `messages` (и в тестовом fetch из Шага 3, и в `chat.js`):

```js
messages: [
    { role: "system", content: "Всегда отвечай только на русском языке." },
    {role: "system", content: "отвечай как психолог."},
    { role: "system", content: userText }
]
```

---

## Шаг 2 — верстаем интерфейс чата

В `index.html` (или новом файле) добавь:

```html
<div class="chat">
    <div class="messages"></div>
    <input type="text" class="user-input" placeholder="Спроси что-нибудь">
    <button class="send-btn">Отправить</button>
</div>

<script src="config.js"></script>
<script src="chat.js"></script>
```

Обрати внимание: `config.js` подключается **раньше** `chat.js` — иначе `API_KEY` ещё не будет существовать.

---

## Шаг 3 — что такое fetch

`fetch` — это как отправить письмо на сервер и подождать ответ. Открой консоль (F12) на любой странице и попробуй:

```js
fetch(`https://api.deepseek.com/chat/completions`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
    },
    body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [ { role: "system", content: "Всегда отвечай только на русском языке." },
        
            { role: "system", content: "Привет!" }
        ]
    })
})
.then(response => response.json())
.then(data => console.log(data.choices[0].message.content));
```

Если всё правильно — через пару секунд в консоли появится ответ нейросети.

---

## Шаг 4 — пишем chat.js

Создай файл `chat.js`:

```js
function sendMessage() {
    const input = document.querySelector('.user-input');
    const messagesBox = document.querySelector('.messages');
    const userText = input.value;

    if (!userText) return; // ничего не делаем если поле пустое

    messagesBox.innerHTML += `<p class="msg-user"><b>Ты:</b> ${userText}</p>`;
    input.value = '';

    fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: userText }]
        })
    })
    .then(response => response.json())
    .then(data => {
        const reply = data.choices[0].message.content;
        messagesBox.innerHTML += `<p class="msg-ai"><b>ИИ:</b> ${reply}</p>`;
    });
}

document.querySelector('.send-btn').addEventListener('click', sendMessage);
```

Открой страницу в браузере, напиши что-нибудь в поле, нажми "Отправить" — жди ответ.

---

## Шаг 5 — практика

Сделай сама:
1. Чтобы сообщение отправлялось не только по клику на кнопку, но и по нажатию Enter (подсказка: `input.addEventListener('keydown', function(event) { ... })`, проверяй `event.key === 'Enter'`)
2. Пока ждём ответ — покажи текст "Печатает..." (добавь его сразу после отправки, а когда придёт ответ — замени)

---

## ДЗ
<!-- 
1. Поменяй `role: "user"` на `role: "system"` первым сообщением в массиве `messages` — задай нейросети характер, например «Отвечай как пират» — и посмотри как изменятся ответы.
2. Спроси наставника, чтобы вместе проверить — точно ли `config.js` не попал вместе с остальными файлами куда не надо. -->
3. Сделай чат красивым — создай файл `style.css`, подключи его в `index.html` (в `<head>` или перед скриптами):

```html
<link rel="stylesheet" href="style.css".
```

Скопируй в `style.css` этот код:

```css
body {
    font-family: Arial, sans-serif;
    background-color: #f0f2f5;
    display: flex;
    justify-content: center;
    padding-top: 40px;
}

.chat {
    width: 400px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
}

.messages {
    height: 350px;
    overflow-y: auto;
    margin-bottom: 12px;
    padding-right: 4px;
}

.messages p {
    padding: 8px 12px;
    border-radius: 12px;
    margin: 6px 0;
    max-width: 80%;
    word-wrap: break-word;
}

.msg-user {
    background-color: #d1e7ff;
    margin-left: auto;
    text-align: right;
}

.msg-ai {
    background-color: #e8e8e8;
    margin-right: auto;
}

.user-input {
    width: 70%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
}

.send-btn {
    padding: 10px 16px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-left: 6px;
}

.send-btn:hover {
    background-color: #357abd;
}
```

Сохрани и открой страницу заново — чат должен выглядеть как настоящее приложение.
