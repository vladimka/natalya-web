require('dotenv').config();

const express = require("express");
const morgan = require('morgan-debug');
const app = express();
const debug = require('debug')('natalya:server');
const PORT = process.env.PORT || 1337;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const socketHandler = require('./handlers/socket.io/index');

app.use(morgan('natalya:server', 'dev'));
app.use(express.static("./public"));

io.on('connection', socketHandler);

server.listen(PORT, "0.0.0.0", () => {
    debug("Server started on http://0.0.0.0:" + PORT);
});