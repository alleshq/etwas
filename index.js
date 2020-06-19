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
        message = message.trim();
        message = message.length > 500 ? `${message.substr(0, 497)}...` : message;
        io.emit("message", socket.username, socket.color, message);
    });

    // Leave
    socket.on("disconnect", () => {
        userCount--;
        io.emit("user count", socket.username, socket.color, userCount, true);
    });
});

// Authentication with token
const jwt = require("jsonwebtoken");
const auth = token => {
    if (typeof token !== "string") return;
    try {
        return jwt.verify(token, process.env.JWT_SECRET).username;
    } catch (err) {}
};

// Username endpoint
app.get("/username", (req, res) => {
    const username = auth(req.headers.authorization);
    res.status(username ? 200 : 401).send(username ? username : "badAuthorization");
});

// OAuth callback
const axios = require("axios");
app.get("/token", async (req, res) => {
    try {
        // Get Access Token
        const {access_token} = (await axios.post("https://api.alles.cx/v1/token", {
            code: req.headers.authorization,
            grant_type: "authorization_code",
            redirect_uri: process.env.REDIRECT_URI ? process.env.REDIRECT_URI : "https://etwas.alles.cx/cb.html"
        }, {
            auth: {
                username: process.env.ALLES_ID,
                password: process.env.ALLES_SECRET
            }
        })).data;

        // Get User
        const {username, plus} = (await axios.get("https://api.alles.cx/v1/me", {
            headers: {
                authorization: `Bearer ${access_token}`
            }
        })).data;

        // Only allow plus members
        if (!plus) return res.status(400).send("plusOnly");

        // Generate JWT
        res.send(jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: "1d"}));
    } catch (err) {
        res.status(500).send("internalError");
    }
});