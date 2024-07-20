const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require("cors")
const helmet = require('helmet');

const driverRoutes = require('./routes/driver.routes');
const binRoutes = require('./routes/bin.routes');
const mqttClient = require('./mqttClient');


const app = express();

//Middlewares
// app.use(express.json)
app.use(bodyParser.json());
const corsOptions ={
  origin:'*', 
  credentials:true,            
  optionSuccessStatus:200
}
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static("public"))
app.use(cors(corsOptions));
app.use(cookieParser());
app.set('etag', false);
app.use(helmet());
app.use((_req, res, next) => {
  
  res.setHeader('Cache-Control', 'no-store');

  next();
});
app.use('/api/driver', driverRoutes);
app.use('/api/bin', binRoutes);

// import routers 
 const UserRoutes=require("./routes/user.routes.js")




//Use routers
app.use("/api/v1/users", UserRoutes)



module.exports= app
