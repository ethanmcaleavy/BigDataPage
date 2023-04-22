const express = require("express");
const server = express();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { spawn } = require("child_process");

server.use(express.static('public'));
server.use('/upload', express.static('upload'));
server.use(fileUpload());
server.set('view engine', 'ejs');


let fileName = "error";

server.listen(8080, () => {
  console.log("Application started and Listening on port 8080");
});

server.get('/', (req, res) => {
    res.render('helloworld.ejs');

    const start = spawn('python',['py-script.py', 'start'])
  
    start.stdout.on(`data`, (data) => {
      console.log(data)
    });

    start.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });

server.get('/newpage', function(req, res) {
  console.log("second " + fileName)

    //Begin child process on getCeleb func
    const celeb = spawn('python',['py-script.py', 'getCeleb', fileName])
  
    let image = ""; 
    celeb.stdout.on(`data`, (data) => {
      image += data; // Append the received data to the variable
      res.render('secondHelloWorld.ejs', { name: fileName, additional: image });
  });

    celeb.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
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
