
const app = require("./app.js")
require("./Database/db.js") 
const dotenv=require("dotenv")
dotenv.config({
    path: './.env'
});

const port = process.env.PORT || 8080;

app.get("/", (_req, res) => {
res.send(" server is running");
});

app.listen(port, () => {
    console.log(` ⚙️ App is running on port  ${port}`);

})