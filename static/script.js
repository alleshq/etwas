const socket = io(`?token=${encodeURIComponent(localStorage.getItem("token"))}`);
const main = document.querySelector("main");

// Update User Count
const updateUserCount = count => document.querySelector("footer .userCount").innerText = `${count} user${count === 1 ? "" : "s"}`;

// Form Submit
const form = document.querySelector("form");
const input = form.querySelector("input");
form.onsubmit = e => {
    e.preventDefault();
    const message = input.value.trim();
    input.value = "";
    if (!message) return;
    socket.emit("message", message);
};

// Get Username
fetch("/username", {
    headers: {
        Authorization: localStorage.getItem("token")
    }
}).then(async res => {
    if (res.status === 200) document.querySelector("footer .username").innerText = await res.text();
    else location.href = `https://alles.cx/authorize?client_id=10caa63a-28af-4b3e-8eeb-d6c6e4f210c2&redirect_uri=${encodeURIComponent(`${location.protocol}//${location.host}/cb.html`)}&response_type=code`;
});

// User Count Update
socket.on("user count", (username, color, count, leave) => {
    updateUserCount(count);
    const p = document.createElement("p");
    p.className = "system";
    p.innerText = ` just ${leave ? "left" : "joined"} the chat.`;
    const span = document.createElement("span");
    span.innerText = `@${username}`;
    span.style.color = `#${color}`;
    p.prepend(span);
    main.append(p);
});

// Message
socket.on("message", (username, color, message) => {
    const p = document.createElement("p");
    p.innerText = `: ${message}`;
    const span = document.createElement("span");
    span.innerText = `@${username}`;
    span.style.color = `#${color}`;
    p.prepend(span);
    main.append(p);
});