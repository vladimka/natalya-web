const express = require("express");
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(express.static("./public"));

app.post('/query', express.json(), async (req, res) => {
    console.log(req.body);
    return await res.json({ answer : new Date(Date.now()).toLocaleDateString() });
});

app.listen(80, "0.0.0.0", () => console.log("Server started"));