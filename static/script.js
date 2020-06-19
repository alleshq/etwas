let userCount = 0;

// UI changes
const updateUserCount = () => document.querySelector("footer .userCount").innerText = `${userCount} user${userCount === 1 ? "" : "s"}`;
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