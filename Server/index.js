const express = require ("express");
const app = express();
const port = 8080;

console.log();
console.log("Endpoint List:");
require("./routes/main")(app, port);
console.log();

app.listen(port, () => console.log(`Server app listening on port ${port}!`));