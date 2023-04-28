const express = require("express");
const server = express();
const fileUpload = require('express-fileupload');
const { spawn } = require("child_process");


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
    var errorMessage = req.query.error;
    res.render('pages/home.ejs', {
      message: errorMessage
    });
  });


  server.get('/uploads', function(req, res) {
    if (fileName == "error.png") //Only allow uploads page if user has inputted valid image
      return res.redirect('/');
    res.render('pages/uploads.ejs', { name: fileArr, data: uploadsArr });
  });


  server.get('/about', function(req, res) {
    res.render('pages/about.ejs');
  });


  server.post('/uploads', (req, res) => {
    // Get the file that was set to our field named "image"
    const { image } = req.files;
    fileName = image.name;
    console.log("image name in post uploads: " + fileName)


    // If no image submitted, exit
    if (!image) return res.sendStatus(400);


    // Move the uploaded image to our upload folder
    image.mv(__dirname + '/upload/' + image.name);


    if (fileName == "error.png") //Only allow uploads page if user has inputted valid image
      return res.redirect('/');
   
    //Create child process
    const py = spawn('python3',['pickleNN.py', fileName]);
    console.log("Entered server.get with fileName: ", fileName);
    //Execute python file
    py.stdout.on(`data`, (data) =>{
      errorOutput = data.toString().trim();
      console.log("nodejs stdout");
      console.log(errorOutput);


      if (errorOutput.includes("No face was recognized"))
        res.redirect('/?error=No%20face%20was%20recognized,%20please%20try%20again%20with%20a%20different%20file.');
      
      else
      {
        uploadsArr.push(JSON.parse(data.toString()));
        fileArr.push(fileName);
        res.redirect('/uploads');
      }
    });


    py.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });
}


func();