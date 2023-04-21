const express = require("express");
const server = express();
const fileUpload = require('express-fileupload');

server.use(express.static('public'));
server.use('/images', express.static('images'));
server.use(fileUpload());



server.listen(8080, () => {
  console.log("Application started and Listening on port 8080");
});

server.get('/', (req, res) => {
    res.sendFile(__dirname + '/helloworld.html');
  });

  server.get('/newpage', function(req, res) {
    res.sendFile(__dirname + '/secondHelloWorld.html');
});

server.get('/newpage2', function(req, res) {
    res.sendFile(__dirname + '/helloworld.html');
});

server.post('/upload', (req, res) => {
  // Get the file that was set to our field named "image"
  const { image } = req.files;

  // If no image submitted, exit
  if (!image) return res.sendStatus(400);

  // Move the uploaded image to our upload folder
  image.mv(__dirname + '/upload/' + image.name);

  res.sendStatus(200);
});
