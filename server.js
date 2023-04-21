const express = require("express");
const server = express();

server.use(express.static('public'));
server.use('/images', express.static('images'));

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
