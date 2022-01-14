const debug = require('debug')('natalya:context');

module.exports.Context = class Context{
    constructor(name, ...steps){
        this.steps = steps;
        this.currentStep = 0;
        this.storage = {};
        this.name = name;
    }

    nextStep(text){
        if(text == '@start@'){
            debug('Запущен контекст: %s', this.name);
        }

        let answer = this.steps[this.currentStep](this.storage, text);
        debug('Шаг: %i', this.currentStep);

        if(this.currentStep >= this.steps.length - 1){
            this.currentStep = 0;
            debug('Контекст "%s" завершён', this.name);
            return { state : 'ended', answer }
        }

        this.currentStep++;

        return { state : 'running', answer };
    }
}