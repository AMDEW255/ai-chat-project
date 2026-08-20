// Сохранять сообщения в localStorage
 
function createMessage(text, sender) {
    return {
        text,
        time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
        sender
    }
}
 
function sendMessage() {
    const input = document.querySelector('.user-input');
    const messagesBox = document.querySelector('.messages');
    const noMessagesBox = document.querySelector('.no-messages');
    const clearBtn = document.querySelector('.clear-btn');
    const userText = input.value;
    let isHaveMessages = false; // есть ли у нас сообщения
 
    if (!userText) return; // ничего не делаем если поле пустое
    // https://chat.deepseek.com/
 
    const ourMessage = createMessage(userText, 'Пользователь:');
    const storageMessages = localStorage.getItem('messages');
    let messagesArray = [];
 
    if (storageMessages) {
        messagesArray = JSON.parse(storageMessages);
        messagesArray.push(ourMessage); 
    } else {
        messagesArray = [ourMessage];
    }

    if (messagesArray.length > 100) {
        messagesArray = messagesArray.slice(-100);
    }


    try {
        localStorage.setItem('messages', JSON.stringify(messagesArray));
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            // Если превышен лимит - очищаем старые сообщения
            messagesArray = messagesArray.slice(-50); // Оставляем только 50 последних
            localStorage.setItem('messages', JSON.stringify(messagesArray));
            console.log('Хранилище очищено, сохранены только последние 50 сообщений');
        }
    }
   
    messagesBox.innerHTML += `
                <p class="msg msg-user">
                    <span class="time">${ourMessage.time}</span>
                    <span class="text">
                        <b>${ourMessage.sender}</b>
                        ${ourMessage.text}
                    </span>
                </p>
            `;
 
    input.value = '';
    isHaveMessages = true;
 
    if (isHaveMessages) {
        noMessagesBox.textContent = '';
        clearBtn.classList.remove('hidden');
    }
 
    fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
    },
    body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [
            { role: "user", content: userText }
        ]
    })
    })
    .then(response => response.json())
    .then(data => {
        const reply = data.choices[0].message.content;
        const aiMessage = createMessage(reply, 'ИИ:');

        // ✅ Добавляем сообщение ИИ в массив
        messagesArray.push(aiMessage);

        // ✅ Обновляем localStorage с учётом ответа ИИ
        try {
            localStorage.setItem('messages', JSON.stringify(messagesArray));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                messagesArray = messagesArray.slice(-50);
                localStorage.setItem('messages', JSON.stringify(messagesArray));
            }
        }

        // Отображаем ответ ИИ на странице
        messagesBox.innerHTML += `
            <p class="msg msg-ai">
                <span class="time">${aiMessage.time}</span>
                <span class="text">
                    <b>${aiMessage.sender}</b>
                    ${aiMessage.text}
                </span>
            </p>
        `;
    });
}
 
function clearMessage() {
    const messages = document.querySelectorAll('.msg');
 
    messages.forEach(function (e) {
        e.remove();
    })
 
    const messagesBox = document.querySelector('.messages');
 
    messagesBox.innerHTML = '<div class="no-messages">Ответов нет</div>';
 
    localStorage.removeItem('messages');

}
 
document.querySelector('.send-btn').addEventListener('click', sendMessage);
document.querySelector('.clear-btn').addEventListener('click', clearMessage);
 
