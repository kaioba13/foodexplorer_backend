const express = require("express");

const routes = require("./routes");

const app = express();

app.use(express.json());

app.use(routes);

const PORT = 7000;
app.listen(PORT, () => console.log(`the server is running on port ${PORT}`));
