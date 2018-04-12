const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ExifImage = require('exif').ExifImage;
const multer = require("multer");
const moment = require("moment");
const sharp = require("sharp");
//const jsonfile = require("jsonfile");
const mongoose = require("mongoose");

const app = express();
const upload = multer({ dest: 'public/original/' });


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
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

// Middleware functions
const readExif = (req,res,next) => {
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
};

const makeThumbImg = (req,res,next) => {
  const url = 'thumb/' + req.file.filename;
  sharp(req.file.path)
  .resize(320, 240)
  .toFile('public/' + url, (err,info) => {
    req.body.thumbnail = url;
    next();
  });
};

const makeMediumImg = (req,res,next) => {
  const url = 'image/' + req.file.filename;
  sharp(req.file.path)
  .resize(770, 720)
  .toFile('public/' + url, (err,info) => {
    req.body.image = url;
    next();
  });
};

const createDataToDB = (req,res) => {
  console.log("Creating data to db...");
  Recipe.create(req.body).then(post => {
    res.send(post);
  });
};

const updateDataToDB = (req,res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err)
      console.log(err);

    if(!recipe) {
      return res.status(404).send({message: "Recipe not found with id " + req.params.id});
    }

    for(const key in req.body) {
      if (req.body[key]) {
        recipe[key] = req.body[key];
      }
    }

    recipe.save((err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send({message: "Recipe updated successfully!"});
        console.log("Recipe updated succesfully");
      }
    });
  });
};

// get all recipe
app.get('/recipes', (req, res) => {
  Recipe.find().then(recipes => {
    res.send(recipes);
  });
});

// upload recipe
app.post('/recipes', upload.single('file'), (req, res, next) => {
  console.log('uploading');
  req.body.time = moment().format('MMMM Do YYYY, h:mm');
  req.body.original = 'original/' + req.file.filename;
  next();
}, readExif, makeThumbImg, makeMediumImg, createDataToDB);


// Update stored data
app.put('/recipes/:id', upload.single('file'), (req,res,next) => {
  req.body.original = 'original/' + req.file.filename;
  next();

}, readExif, makeThumbImg, makeMediumImg, updateDataToDB);

// Delete stored data
app.delete('/recipes/:id', (req,res) => {
  Recipe.findByIdAndRemove(req.params.id, (err, recipe) => {
    if (err)
      console.log("ERROR" + err);

    if (!recipe) {
      return res.status(404).
          send({message: "Recipe not found with id " + req.params.id});
    }

    res.send({message: "Recipe deleted successfully!"});
  });
});

const toDecimal = (gpsData,ref) => {
  let coordinate = gpsData[0] + gpsData[1]/60 + gpsData[2]/3600;
  return (ref == "S" || ref == "W") ? coordinate*-1 : coordinate;
};
