const expresss = require("express");
const morgan = require('morgan');
const app = expresss();

app.use(morgan('dev'));
app.use(expresss.static("./public"));

app.listen(80, "0.0.0.0", () => console.log("Server started"));