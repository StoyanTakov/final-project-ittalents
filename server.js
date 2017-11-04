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

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));         //Setting the default url for the front-end
app.use('/api', appRoutes);    //Setting a url for the connection with the back-end in case of matched url's


//multers disk storage settings,  destination path to save our files, rename our file, 
var storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, '/uploads/')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
  }
});


//multer settings,type of upload multi/single
var upload = multer({ 
  storage: storage
}).single('file');


// API path that will upload the files; check if there was an error while performing upload
app.post('/uploads', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    res.json({ error_code: 0, err_desc: null });
  });
});

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