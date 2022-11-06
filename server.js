const app = require("./app");
const connect = require("./src/configs/db");

app.listen(5000, async () => {
  await connect();
  console.log("Listening to PORT 5000");
});
