const express = require("express");
const server = express();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const ejs = require('ejs');
let fileName = "error";

const { spawn } = require("child_process");

server.use(express.static('public'));
server.use('/upload', express.static('upload'));
server.use(fileUpload());
server.set('view engine', 'ejs');


server.listen(8080, () => {
  console.log("Application started and Listening on port 8080");
});






server.get('/', (req, res) => {
    res.render('helloworld.ejs');
  });



  server.get('/newpage', function(req, res) {
    console.log("second " + fileName)
    res.render('secondHelloWorld.ejs',  { name: fileName});
});

server.get('/newpage2', function(req, res) {
    res.render('helloworld.ejs');
});

server.post('/upload', (req, res) => {
  // Get the file that was set to our field named "image"
  const { image } = req.files;
  fileName = image.name;
  console.log("image name: " + fileName)

  // If no image submitted, exit
  if (!image) return res.sendStatus(400);

  // Move the uploaded image to our upload folder
  image.mv(__dirname + '/upload/' + image.name);
  res.redirect('/newpage');
});
