const express = require("express");
const server = express();
const fileUpload = require('express-fileupload');

const axios = require('axios');
server.use(express.static(__dirname + '/'));
server.use('/upload', express.static('upload'));
server.use(fileUpload());
server.set('view engine', 'ejs');

const func = () => { //code in func to remove global variables

  let fileName = "error.png";
  let uploadsArr = []; //array of returned celebrity data
  let fileArr = []; //array of uploaded images

  server.listen(8080, () => {
    console.log("Application started and Listening on port 8080");
  });

  server.get('/', (req, res) => {
    res.render('pages/home.ejs');
  });

  server.get('/uploads', function(req, res) {
    if (fileName == "error.png") //Only allow uploads page if user has inputted valid image
      return res.redirect('/');

    axios.get('http://127.0.0.1:8123/getSimiliar')
      .then(response => {
        let data = response.data.message;
        console.log(data);

        uploadsArr.push(data);
        fileArr.push(fileName);

        res.render('pages/uploads.ejs', { name: fileArr, data: uploadsArr})
      })
      .catch(error => {
        console.error(error);
      });
  });

  server.get('/about', function(req, res) {
    res.render('pages/about.ejs');
  });

  server.post('/uploads', (req, res) => {
    // Get the file that was set to our field named "image"
    const { image } = req.files;
    fileName = image.name;
    console.log("image name: " + fileName)

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    image.mv(__dirname + '/upload/' + image.name);
    res.redirect('/uploads');
  });
}

func();