const fs = require('fs');
const path = require('path');

class InitializationError extends Error{
    constructor(msg){
        super();
        this.name = 'InitializationError';
        this.message = msg;
    }
}

class Brains{
    constructor(sinonimsFile = 'sinonims.json', answersFile = 'answers.json'){
        this.sinonimsFile = path.join(__dirname, sinonimsFile);
        this.answersFile = path.join(__dirname, answersFile);
        this.sinonims = {};
        this.answers = {};

        this.loadConfiguration();
    }

    tokenize(text){
        let synonimsKeys = Object.keys(this.sinonims);

        synonimsKeys.forEach(synonimKey => {
            let synonims = this.sinonims[synonimKey];
            synonims.forEach(synonim => {
                if(!new RegExp(synonim, 'ig').test(text))return;
                console.log('Найдено и заменено совпадение с синонимом ' + synonimKey);
                text = text.replace(synonim, synonimKey);
            });
        });

        return text;
    }

    processAnswer(key){
        const variables = {
            hours : new Date(Date.now()).getHours(),
            minutes : new Date(Date.now()).getMinutes(),
        }

        let answer = this.answers[key];
        answer = answer[Math.floor(Math.random()*answer.length)];

        answer = answer.replace(/@(.+?)\s+/ig, (_, varName) => variables[varName] + " ");

        return answer;
    }

    getAnswer(text){
        let tokenizedText = this.tokenize(text);
        console.log(`Текст с заменёнными синонимами: ${tokenizedText}`);
        let answersKeys = Object.keys(this.answers);
        let answer = '';

        answersKeys.forEach(key => {
            if(!new RegExp(key).test(tokenizedText))
                return;
            answer = this.processAnswer(key);
        });
        console.log(`Полученный ответ: ${answer}`);

        return answer;
    }

    loadConfiguration(){
        console.log('Initialization started.\nLoading config files...');

        if(!fs.existsSync(this.sinonimsFile))
            throw new InitializationError('Initialization failed: No sinonims file found');

        this.sinonims = JSON.parse(fs.readFileSync(this.sinonimsFile, 'utf-8'));

        if(!fs.existsSync(this.answersFile))
            throw new InitializationError('Initialization failed: No answers file found');

        this.answers = JSON.parse(fs.readFileSync(this.answersFile, 'utf-8'));

        console.log('Initialization complete.');
    }
}

module.exports.Brains = Brains;
module.exports.InitializationError = InitializationError;