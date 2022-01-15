const queryForm = document.querySelector('.query-form');
const historyUl = document.querySelector('.history');
const queryInput = document.querySelector('.query-input');
const socket = io();
let sid = 0;

socket.emit('natalya-getsid');
socket.on('natalya-sid', id => sid = id);

socket.on('natalya-answer', data => {
    historyUl.innerHTML += `
        <div class="natalya-answer shadow">${data.text}</div>
    `;
});

queryForm.onsubmit = async e => {
    e.preventDefault();

    let text = queryInput.value;

    if(text == '')
        return;

    historyUl.innerHTML += `
        <div class="user-text shadow">${text}</div>
    `;
    text = text.trim().replace(/[.,!?]/g, '').toLowerCase();
    queryInput.value = '';

    socket.emit('natalya-query', { text, sid });
}