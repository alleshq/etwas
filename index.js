// HTTP Server
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(8080, () => console.log("Server is listening..."));

// Static
app.use(express.static(`${__dirname}/static`));

// Socket.io
io.use((socket, next) => {
    socket.username = auth(socket.handshake.query.token);
    if (!socket.username) return next(new Error("Authentication Error"));
    socket.color = (Math.random()*0xFFFFFF<<0).toString(16);
    next();
});

io.on("connection", socket => {
    console.log(socket.username);
});

// Authentication with token
const auth = token => {
    if (typeof token !== "string") return;
    return token;
};