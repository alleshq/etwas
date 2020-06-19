let userCount = 0;

// HTTP Server
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(8080, () => console.log("Server is listening..."));

// Static
app.use(express.static(`${__dirname}/static`));

// Socket Auth
io.use((socket, next) => {
    const username = auth(socket.handshake.query.token);
    if (!username) return next(new Error("Authentication Error"));
    socket.username = username;
    socket.color = (Math.random()*0xFFFFFF<<0).toString(16);
    next();
});

// Socket Connection
io.on("connection", socket => {
    userCount++;
    io.emit("user join", socket.username, userCount);
});

// Authentication with token
const auth = token => {
    if (typeof token !== "string") return;
    return token;
};