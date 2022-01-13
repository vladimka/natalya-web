const queryForm = document.querySelector('.query-form');
const historyUl = document.querySelector('.history');
const queryInput = document.querySelector('.query-input');

queryForm.onsubmit = async e => {
    e.preventDefault();

    let text = queryInput.value.trim();

    if(text == '')
        return;

    historyUl.innerHTML += `
        <div class="user-text shadow">${text}</div>
    `;

    let answer = await getAnswer(text);
    historyUl.innerHTML += `
        <div class="natalya-answer shadow">${answer}</div>
    `;

    queryInput.value = '';
}

async function getAnswer(text){
    const data = await fetch('/query', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ query : text })
        })
        .then(res => res.json())
        .catch(console.error);
    console.log(data);
    return data.answer;
}