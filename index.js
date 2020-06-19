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
    socket.username = auth(socket.handshake.query.token);
    if (socket.username) next();
    else next(new Error("Authentication Error"));
});

// Socket Connection
io.on("connection", socket => {
    // Set Color
    socket.color = (Math.random()*0xFFFFFF<<0).toString(16);
    
    // Change User Count
    userCount++;
    io.emit("user count", socket.username, socket.color, userCount, false);

    // Message
    socket.on("message", message => {
        io.emit("message", socket.username, socket.color, message);
    });

    // Leave
    socket.on("disconnect", () => {
        userCount--;
        io.emit("user count", socket.username, socket.color, userCount, true);
    });
});

// Authentication with token
const auth = token => {
    if (typeof token !== "string") return;
    return token;
};

// Username endpoint
app.get("/username", (req, res) => {
    const username = auth(req.headers.authorization);
    res.status(username ? 200 : 401).send(username ? username : "badAuthorization");
});