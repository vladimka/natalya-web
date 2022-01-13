require('dotenv').config();

const express = require("express");
const morgan = require('morgan-debug');
const app = express();
const debug = require('debug')('natalya:server');
const { Brains, InitializationError } = require('./brains/core');

const PORT = process.env.PORT || 1337;
let natalya;

app.use(morgan('natalya:server', 'dev'));
app.use(express.static("./public"));

app.post('/query', express.json(), async (req, res) => {
    let { query } = req.body;
    let answer = natalya.getAnswer(query);

    return await res.json({ answer });
});

app.listen(PORT, "0.0.0.0", () => {
    try{
        natalya = new Brains();
    }catch(err){
        if(err instanceof InitializationError){
            debug(err.message);
            process.exit(-1);
        }
    }
    debug("Server started on http://0.0.0.0:" + PORT);
});