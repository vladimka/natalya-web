const fs = require('fs');
const path = require('path');
const debug = require('debug')('natalya:core');
const { Context } = require('./context');

const TestContext = new Context(
    'test',
    (ctx, text) => 'Как тебя зовут?',
    (ctx, text) => (ctx.name = text, `Привет, ${ctx.name}`),
);

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
        this.contexts = { 'test' : TestContext };
        this.currentContext = '';

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

    startContext(contextName){
        if(this.currentContext != '')
            return;

        let context = this.contexts[contextName];
        this.currentContext = contextName;

        return context.nextStep('@start@').answer;
    }

    processAnswer(key){
        const daysOfWeek = [
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятнца",
            "Суббота",
            "Воскресенье"
        ]

        const variables = {
            hours : new Date(Date.now()).getHours(),
            minutes : new Date(Date.now()).getMinutes(),
            date : new Date(Date.now()).getDate(),
            day : daysOfWeek[new Date(Date.now()).getDay() - 1]
        }

        let answer = this.answers[key];
        answer = answer[Math.floor(Math.random()*answer.length)];
        debug(`Выбранный ответ: %s`, answer);
        answer = answer.replace(/\$\{(.+?)\}/ig, (_, code) => {
            try{
                let res = eval(code);

                if(res == undefined | NaN | null)
                    return '';

                return res.toString();
            }catch(err){
                return 'Произошла ошибка при обработке вопроса. Обратитесь к моему создателю.'
            }
        });

        return answer;
    }

    getAnswer(text){
        debug('Получен вопрос: %s', text);

        if(this.currentContext != ''){
            let context = this.contexts[this.currentContext];
            let res = context.nextStep(text);

            if(res.state = 'ended'){
                this.currentContext = '';
            }

            return res.answer;
        }

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