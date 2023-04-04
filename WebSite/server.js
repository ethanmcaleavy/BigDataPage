const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');

// database configuration
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  };
  
  const db = pgp(dbConfig);
  var max = 10;
  var artistMax = 10;
  var prevSearch = "";
  var prevArtistSearch = "";
  
  // test your database
  db.connect()
    .then(obj => {
      console.log('Database connection successful'); // you can view this message in the docker compose logs
      obj.done(); // success, release the connection;
    })
    .catch(error => {
      console.log('ERROR:', error.message || error);
    });

    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/'));
    app.use(bodyParser.json());

    app.use(
        session({
          secret: process.env.SESSION_SECRET,
          saveUninitialized: false,
          resave: false,
        })
      );
      
      app.use(
        bodyParser.urlencoded({
          extended: true,
        })
      );

      app.get('/', (req, res) =>{
        res.redirect('/main');
      });

      app.get('/main', (req, res) => 
      {
        prevSearch = "";
        const deleteQuery = "delete from songs";
        db.any(deleteQuery);

        const query = "select * from songs";
        db.any(query)
          .then((songs) => 
          {
              res.render("pages/main.ejs", 
              {
                songs, rows: max
              });
          })
        .catch((err) => {
            res.render("pages/main.ejs", 
            {
                songs: [],
                rows: 0,
                errors: true,
                message: err.message,
            });
        });

          
        });

        app.post('/main', async (req, res) => 
        {
          var search = req.body.search;//'%' + req.body.searchTerm + '%';
          var maxResults = req.body.maxResults;

          if (search == "")
          {
            search = prevSearch;
          }

          if (req.body.maxResults != 0)
            max = maxResults;
          else
            maxResults = max;

            prevSearch = search;

          await axios.get('https://itunes.apple.com/search?media=music&entity=musicTrack&attribute=songTerm&term=' + search)
          .then(async results=> {
            var count = results.data.resultCount;

            if (count > maxResults) 
              count = maxResults;
            for (let i = 0; i < count; i++) 
            {
              if (results.data.results[i].trackName != null)
              {
                let songsQuery = 'insert into songs (name, artwork_url, artist_name, genre, release_date, link) values ($1, $2, $3, $4, $5, $6);';
                await db.any(songsQuery, [
                  results.data.results[i].trackName.substring(0, 100),
                  results.data.results[i].artworkUrl100,
                  results.data.results[i].artistName.substring(0, 100),
                  results.data.results[i].primaryGenreName.substring(0, 100),
                  results.data.results[i].releaseDate.substring(0, 100),
                  results.data.results[i].trackViewUrl
                ])
              }
              else
              {
                count++; //add to count cause skipping track
              }
            }
            
              const query = "select * from songs";
              db.any(query)
              .then((songs) => 
              {
                if (count != 0)
                {
                  res.render("pages/main.ejs", 
                  {
                    songs, rows: maxResults
                  });
                }
                else
                {
                  res.render("pages/main.ejs", 
                  {
                    songs, rows: maxResults, message: "No Search Results"
                  });
                }
              })
              .catch((err) => 
              {
                    res.render("pages/main.ejs", 
                    {
                      songs: [],
                      rows: 0,
                      errors: true,
                      message: err.message,
                    });
              });
            })
            .catch(function (error) 
            {
              console.log(error);
            });

            const deleteQuery = "delete from songs";
            await db.any(deleteQuery);
          })


        app.get('/artist', (req, res) => 
        {
          prevArtistSearch  = "";
          const deleteQuery = "delete from songs";
          db.any(deleteQuery);

          const query = "select * from songs";
          db.any(query)
          .then((songs) => 
          {
              res.render("pages/artist.ejs", 
              {
                songs, rows: artistMax
              });
          })
          .catch((err) => {
              res.render("pages/artist.ejs", 
              {
                  songs: [],
                  rows: 0,
                  errors: true,
                  message: err.message,
              });
          });  
        });

        app.post('/artist', async (req, res) => 
        {
          var search = req.body.search;//'%' + req.body.searchTerm + '%';
          var maxResults = req.body.maxResults;

          if (search == "")
          {
            search = prevArtistSearch;
          }

          if (req.body.maxResults != 0)
            artistMax = maxResults;
          else
            maxResults = artistMax;

            prevArtistSearch = search;

          await axios.get('https://itunes.apple.com/search?media=music&entity=musicTrack&attribute=artistTerm&term=' + search)
          .then(async results=> {
            var count = results.data.resultCount;

            if (count > maxResults) 
              count = maxResults;
            for (let i = 0; i < count; i++) 
            {
              if (results.data.results[i].trackName != null)
              {
                let songsQuery = 'insert into songs (name, artwork_url, artist_name, genre, release_date, link) values ($1, $2, $3, $4, $5, $6);';
                await db.any(songsQuery, [
                  results.data.results[i].trackName.substring(0, 100),
                  results.data.results[i].artworkUrl100,
                  results.data.results[i].artistName.substring(0, 100),
                  results.data.results[i].primaryGenreName.substring(0, 100),
                  results.data.results[i].releaseDate.substring(0, 100),
                  results.data.results[i].trackViewUrl
                ])
              }
              else
              {
                count++; //add to count cause skipping track
              }
            }
            
              const query = "select * from songs";
              db.any(query)
              .then((songs) => 
              {
                if (count != 0)
                {
                  res.render("pages/artist.ejs", 
                  {
                    songs, rows: maxResults
                  });
                }
                else
                {
                  res.render("pages/artist.ejs", 
                  {
                    songs, rows: maxResults, message: "No Search Results"
                  });
                }
              })
              .catch((err) => 
              {
                    res.render("pages/artist.ejs", 
                    {
                      songs: [],
                      rows: 0,
                      errors: true,
                      message: err.message,
                    });
              });
            })
            .catch(function (error) 
            {
              console.log(error);
            });

            const deleteQuery = "delete from songs";
            await db.any(deleteQuery);
          })


          app.get('/reviews', (req, res) => 
          {
            const query = "select * from reviewedSongs";
            db.any(query)
            .then((reviewedSongs) => {
                res.render("pages/reviews.ejs", 
                {
                  reviewedSongs
                });
            })
            .catch((err) => {
                res.render("pages/reviews.ejs", 
                {
                  reviewedSongs: [],
                    errors: true,
                    message: err.message,
                });
            });
          });

          app.post('/reviews', async (req, res) => 
          {
            let time = Date.now();
            let newDate = new Date(time);
            let date = newDate.getDate();
            let month = newDate.getMonth() + 1;
            let year = newDate.getFullYear();
            let reviewDate = year + "/" + month + "/" + date;

            let songsQuery = 'insert into reviewedSongs (name, reviewer_name, artwork_url, artist_name, genre, release_date, link, rating, description, review_date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);';
                await db.any(songsQuery, [
                  req.body.name,
                  req.body.reviewName.substring(0, 100),
                  req.body.image,
                  req.body.artist,
                  req.body.genre,
                  req.body.release_date,
                  req.body.link,
                  req.body.rating,
                  req.body.description.substring(0, 100),
                  reviewDate
                ])

            res.redirect('/reviews');
          })

                
app.listen(3000);
console.log('Server is listening on port3000');