const queryForm = document.querySelector('.query-form');
const historyUl = document.querySelector('.message-list');
const queryInput = document.querySelector('.query-input');
const socket = io();
let sid = 0;

socket.emit('natalya-getsid');
socket.on('natalya-sid', id => sid = id);

socket.on('natalya-answer', data => {
    renderMessage(data.text);
});

queryForm.onsubmit = async e => {
    e.preventDefault();

    let text = queryInput.value;

    if(text == '')
        return;

    renderMessage(text, true);
    text = text.trim().replace(/[.,!?]/g, '').toLowerCase();
    queryInput.value = '';

    socket.emit('natalya-query', { text, sid });
}

function renderMessage(text, fromMe=false){
    let timestamp = new Date(Date.now()).toLocaleTimeString().split(":");
    timestamp.splice(2, 1);
    timestamp = timestamp.join(":");

    historyUl.innerHTML += `
        <div class="message-wrapper ${fromMe ? "mine" : ""}">
            <div class="message ${fromMe ? "mine" : ""} shadow">
                ${!fromMe ? "<p class='name'>Наталья</p>" : ""}
                ${text}
                <p class="timestamp">${timestamp}</p>
            </div>
        </div>
    `;
}