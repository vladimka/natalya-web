const queryForm = document.querySelector('.query-form');
const historyUl = document.querySelector('.history');
const queryInput = document.querySelector('.query-input');

queryForm.onsubmit = e => {
    e.preventDefault();

    let text = queryInput.value.trim();

    if(text == '')
        return;

    historyUl.innerHTML += `
        <li class="user-text shadow">${text}</li>
    `;

    let answer = getAnswer(text);
    historyUl.innerHTML += `
        <li class="natalya-answer shadow">${answer}</li>
    `;

    queryInput.value = '';
}

function getAnswer(text){
    return "Извините, я, пока что, вас не понимаю:(";
}