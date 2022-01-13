const fs = require('fs');
const path = require('path');
const debug = require('debug')('natalya:core');

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
                debug('Найдено и заменено совпадение с синонимом: %s -> %s', new RegExp(`(?<word>${synonim})`).exec(text).groups.word, synonimKey);
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
        debug(`Выбранный ответ: %s`, answer);
        answer = answer.replace(/\$\{(.+?)\}/ig, (_, code) => eval(code));

        return answer;
    }

    getAnswer(text){
        let tokenizedText = this.tokenize(text);
        debug(`Текст с заменёнными синонимами: %s`, tokenizedText);
        let answersKeys = Object.keys(this.answers);
        let answers = [];

        for(let key of answersKeys){
            if(!new RegExp(key).test(tokenizedText))
                    continue;
            answers.push(this.processAnswer(key));
        }
        debug(`Полученный ответ: %j`, answers);

        return answers.length > 0 ? answers.join(' ') : "Извините, я вас не поняла. Можете повторить?";
    }

    loadConfiguration(){
        debug('Инициализация.\nЗагрузка конфигурации...');

        if(!fs.existsSync(this.sinonimsFile))
            throw new InitializationError('Инициализация провалена: Файл синонимов не найден');

        this.sinonims = JSON.parse(fs.readFileSync(this.sinonimsFile, 'utf-8'));

        if(!fs.existsSync(this.answersFile))
            throw new InitializationError('Инициализация провалена: Файл ответов не найден');

        this.answers = JSON.parse(fs.readFileSync(this.answersFile, 'utf-8'));

        debug('Инициализация закончена.');
    }
}

module.exports.Brains = Brains;
module.exports.InitializationError = InitializationError;