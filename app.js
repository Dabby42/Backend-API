//Require all that's needed to power this App
//adding a few documentation
require('./models/User');
require('./config/dbconnection');
const rfs              = require('rotating-file-stream'),
      expressValidator = require("express-validator"),
      bodyParser       = require("body-parser"),
      express          = require("express"),
      morgan           = require('morgan'),
      path             = require("path"),
      fs               = require('fs'),
      app              = express();

require("dotenv").config();
let AuthRoute = require("./routes/v1/AuthRoute");

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs')
})

//=========================================================
//All Middlewares here
//=========================================================
// Tell the bodyparser middleware to accept more data
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('combined', { stream: accessLogStream }));

//allowing for serving static files
app.use(expressValidator());

// allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(__dirname + '/public/v1'));

// Authentication Route
app.use("/v1/auth",AuthRoute);

//=========================================================
//Running the server on Port 3000 default
let PORT = process.env.PORT;
app.listen(PORT, () => {console.log(`App is running on Port ${PORT}`)});
