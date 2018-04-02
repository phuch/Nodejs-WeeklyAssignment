const express = require("express");
const cors = require("cors");
const ExifImage = require('exif').ExifImage;
const multer = require("multer");
const moment = require("moment");
const sharp = require("sharp");
const jsonfile = require("jsonfile");
const mongoose = require("mongoose");

const app = express();
const upload = multer({ dest: 'public/original/' });


app.use(cors());
moment.locale();

// Database setup

// Db connection
mongoose.connect('mongodb://localhost:27017/recipes').then(() => {
  console.log('Connect to database successfully.');
  app.listen(8080);
}, err => {
  console.log('Connect to db failed: ' + err);
});

// Schema
const Schema = mongoose.Schema;
const recipe = new Schema({
  id: Number,
  time: String,
  category: String,
  title: String,
  details: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  thumbnail: String,
  image: String,
  original: String
});

// Model
const Recipe = mongoose.model('Recipe', recipe);

// get all recipe
app.get('/recipes', (req, res) => {
  Recipe.find().then(recipes => {
    res.send(recipes);
  });
});

// upload image
app.post('/upload', upload.single('file'), (req, res, next) => {
  req.body.time = moment().format('MMMM Do YYYY, h:mm');
  req.body.original = 'original/' + req.file.filename;
  next();
});

// read EXIF
app.use((req, res, next) => {
  try {
    new ExifImage({ image : req.file.path }, function (error, exifData) {
      const gpsData = exifData.gps;
      if (error) {
        console.log('Error: ' + error.message);
        next();
      } else {
        if (gpsData.GPSLatitude || gpsData.GPSLongitude) {
          req.body.coordinates = {
            lat: toDecimal(gpsData.GPSLatitude, gpsData.GPSLatitudeRef),
            lng: toDecimal(gpsData.GPSLongitude, gpsData.GPSLongitudeRef)
          }
        } else {
          console.log("NO GPS DATA");
          req.body.coordinates = null;
        }
        next();
      }
    });
  } catch (error) {
    console.log('Error: ' + error.message);
    next();
  }
});

// Convert image to small version
app.use((req, res, next) => {
  const url = 'thumb/' + req.file.filename;
  sharp(req.file.path)
    .resize(320, 240)
    .toFile('public/' + url, (err,info) => {
      req.body.thumbnail = url;
      next();
    });
});

// Convert image to medium version
app.use((req, res, next) => {
  const url = 'image/' + req.file.filename;
  sharp(req.file.path)
  .resize(770, 720)
  .toFile('public/' + url, (err,info) => {
    req.body.image = url;
    next();
  });
});

// save data to data.json
app.use((req, res, next) => {
  const file = 'data.json';
  jsonfile.readFile(file, (err, obj) => {
    if (obj === undefined) {
      obj = [];
    }

    obj.push(req.body);
    jsonfile.writeFile(file, obj, (err) => {
      if (err)
        console.error(err);
      else
        console.log("Save data to json file successfully!");
      next();
    });
  });
});

// save data to db
app.use((req, res) => {
  console.log("Save data to db...");
  Recipe.create(req.body).then(post => {
    console.log(post._id);
    res.send(post);
  });
});

const toDecimal = (gpsData,ref) => {
  let coordinate = gpsData[0] + gpsData[1]/60 + gpsData[2]/3600;
  return (ref == "S" || ref == "W") ? coordinate*-1 : coordinate;
};
