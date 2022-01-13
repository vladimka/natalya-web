const express = require("express");
const morgan = require('morgan');
const app = express();
const { Brains, InitializationError } = require('./brains/core');
let natalya;

app.use(morgan('dev'));
app.use(express.static("./public"));

app.post('/query', express.json(), async (req, res) => {
    let { query } = req.body;
    console.log(query);
    let answer = natalya.getAnswer(query);
    console.log(answer);

    return await res.json({ answer });
});

app.listen(80, "0.0.0.0", () => {
    try{
        natalya = new Brains();
    }catch(err){
        if(err instanceof InitializationError){
            console.log(err.message);
            process.exit(-1);
        }
    }
    console.log("Server started");
});