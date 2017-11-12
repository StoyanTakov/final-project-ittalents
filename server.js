var express = require("express");
var app = express();
var multer = require('multer');
var port = process.env.PORT || 8080;
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var router = express.Router();
var appRoutes = require('./app/routes/api')(router); //Setting the routers
var path = require('path');
var passport = require('passport');
var social = require('./app/passport/passport')(app, passport);
var fs = require('fs');
var Video = require("./app/models/video");
// MIDDLEWARES
//allow cross origin requests for the uploads
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public')); //Setting the default url for the front-end
app.use('/api', appRoutes); //Setting a url for the connection with the back-end in case of matched url's



//Connecting to the database with mongoose
mongoose.connect('mongodb://localhost:27017/youtubedb', function (err) {
  if (err) {
    console.log("Not connected to the database.");
  } else {
    console.log("Successfully connected to MongoDB.");
  }
});


app.get('/stream/:url', function (req, res) {
  const path = './uploads/' + req.params.url;
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ?
      parseInt(parts[1], 10) :
      fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, {
      start,
      end
    })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})
  // Getting all videos in the data
app.get('/api/allVideos', function (req, res) {
    Video.find({}).exec(function (err, videos) {
        // console.log(req.decoded)
        // console.log(video)
        if (videos !== null) {
            res.send(videos);
        } else {
            res.json({ success: false });
        }
    })
})
    //API for getting a specific video
app.get('/api/video/:name', function (req, res) {
  Video.findOne({ url: req.params.name }).exec(function (err, videos) {
      // console.log(req.decoded)
      // console.log(video)
      if (videos !== null) {
          res.send(videos);
      }
  })
      //API for searching videos
  app.get('/api/searchVideos/:name', function (req, res) {
      Video.find({ name: req.params.name }).exec(function (err, videos) {
          // console.log(req.decoded)
          console.log(videos)
          if (videos !== null) {
              res.send(videos);
          }
      })
  })
})
//Responding with the index.html when entering the website
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + "/public/app/views/index.html"));
})

app.listen(port, function () {
  console.log("Running the server on port " + port);
})