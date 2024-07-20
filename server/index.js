

const app = require("./app")
require("./Database/db") 

require("dotenv").config();

const port = process.env.PORT || 8080;




app.get("/", (_req, res) => {
res.send("server is running");
});

app.listen(port, () => {
    console.log(`App is running on port  ${port}`);

})