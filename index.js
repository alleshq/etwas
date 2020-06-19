const express = require("express");
const app = express();
app.listen(8080);

// Static
app.use(express.static(`${__dirname}/static`));