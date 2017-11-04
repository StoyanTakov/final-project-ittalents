var express       = require("express");
var app           = express();
var multer        = require('multer');
var port          = process.env.PORT || 8080;
var morgan        = require("morgan");
var mongoose      = require("mongoose");
var bodyParser    = require("body-parser");
var router        = express.Router();
var appRoutes     = require('./app/routes/api')(router);    //Setting the routers
var path          = require('path');

// MIDDLEWARES
//allow cross origin requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));         //Setting the default url for the front-end
app.use('/api', appRoutes);    //Setting a url for the connection with the back-end in case of matched url's


//Connecting to the database with mongoose
mongoose.connect('mongodb://localhost:27017/youtubedb', function (err) {
  if (err) {
    console.log("Not connected to the database.");
  } else {
    console.log("Successfully connected to MongoDB.");
  }
});

//Responding with the index.html when entering the website

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + "/public/app/views/index.html"));
})

app.listen(port, function () {
  console.log("Running the server on port " + port);
})