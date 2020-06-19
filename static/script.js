const socket = io("?token=archie");

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
        Authorization: "archie"
    }
}).then(async res => {
    document.querySelector("footer .username").innerText = await res.text();
});

// User Count Update
socket.on("user count", (username, color, count, leave) => {
    updateUserCount(count);
});

// Message
socket.on("message", (username, color, message) => {
    console.log(`@${username}#${color}: ${message}`);
});