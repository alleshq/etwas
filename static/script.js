const socket = io("?token=archie");

// UI changes
const updateUserCount = count => document.querySelector("footer .userCount").innerText = `${count} user${count === 1 ? "" : "s"}`;
const setUsername = username => document.querySelector("footer .username").innerText = username;

// Form Submit
const form = document.querySelector("form");
const input = form.querySelector("input");
form.onsubmit = e => {
    e.preventDefault();
    const message = input.value.trim();
    input.value = "";
    if (!message) return;
    console.log(message);
};

// User Join
socket.on("user join", (username, count) => {
    updateUserCount(count);
});