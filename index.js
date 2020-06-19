// HTTP Server
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(8080, () => console.log("Server is listening..."));

// Static
app.use(express.static(`${__dirname}/static`));

// Socket.io
io.on("connection", socket => {
    socket.on("add user", token => {
        const username = auth(token);
        if (!username) return;

        socket.username = username;
        socket.color = (Math.random()*0xFFFFFF<<0).toString(16);
        io.emit("user joined", username);
    });
});

// Authentication with token
const auth = token => {
    if (typeof token !== "string") return;
    return "archie";
};