// TO BE RUN FOR EVERY NEW PROJECT:
// npm init --yes
// npm i express
// npm i joi

// GLOBALLY INSTALLED:
// npm i -g nodemon

// LEGEND:
// * - endpoints to be added
// TODO - functionalities to be added

// Joi input validation module
const Joi = require('joi');
// Express module
const express = require('express');
const app = express();

// App made to recognise incoming request objects as JSON objects
app.use(express.json());

// Array containing JSON objects, each defining an individual song
const songs = [
  {
    id: 1,
    name: "Can't Help Falling In Love",
    artist: "Elvis Presley",
    duration: "2:59",
    genre: "Rock",
    plays: 4
  },
  {
    id: 2,
    name: "I Wanna Be Yours",
    artist: "Arctic Monkeys",
    duration: "3:03",
    genre: "Alternative Rock",
    plays: 5
  },
  {
    id: 3,
    name: "Do I Wanna Know",
    artist: "Arctic Monkeys",
    duration: "4:33",
    genre:  "Alternative Rock",
    plays: 3
  },
  {
    id: 4,
    name: "You Shook Me All Night Long",
    artist: "AC/DC",
    duration: "3:32",
    genre:  "Rock",
    plays: 10
  },
  {
    id: 5,
    name: "Teenage Dirtbag",
    artist: "Wheatus",
    duration: "undefined",
    genre:  "undefined",
    plays: 25
  }
];

// Get introduction page
app.get('/api', (req, res) => {
  res.send("Welcome to the Song Database API!");
});
// Get all songs
app.get('/api/songs', (req, res) => {
  res.send(songs);
});
// Get song from id
// TODO: modularise 404 error check
app.get('/api/songs/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (!song) res.status(404).send("Song with id: " + req.params.id + " not found");
  else res.send(song);
});
//* Get songs from name
//* Get songs from artist
//* Get songs from integer duration as lower bound - 'get songs with duration >='
//* Get songs from genre
//* Get songs from integer plays as lower bound - 'get songs with plays >='

//* Get most listened to song
//* Get most listened to artist
//* Get most listened to genre

// Play song from id
app.put('/api/songs/play/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (!song) res.status(404).send("Song with id: " + req.params.id + " not found");
  song.plays += 1;
  res.send(song);
});
//* Play song from name
//* Play random song from artist
//* Play random song from genre

// Update song from id
// TODO: check that at least one attribute is being updated
//        check that all attributes being updated are valid
app.put('/api/songs/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (!song) res.status(404).send("Song with id: " + req.params.id + " not found");
  song.name = req.body.name || song.name;
  song.artist = req.body.artist || song.artist;
  song.duration = req.body.duration || song.duration;
  song.genre = req.body.genre || song.genre;
  res.send(song);
});

// Create song
// TODO: check for duplicates and keep most complete JSON
//        capitalise first letters of attributes
app.post('/api/songs', (req, res) => {
  const {error} = validateRequestBody(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const song = {
    id: songs.length + 1,
    name: req.body.name,
    artist: req.body.artist,
    duration: req.body.duration || "undefined",
    genre: req.body.genre || "undefined",
    plays: 0
  };
  songs.push(song);
  res.send(song);
});

// Delete song from id
app.delete('/api/songs/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (!song) res.status(404).send("Song with id: " + req.params.id + " not found");
  res.send(songs.splice(songs.indexOf(song), 1));
})

// Function to validate request body format
// TODO: regex for each attribute (not case-sensitive)
//        show all missing or incorrect attribute errors at once
function validateRequestBody(song) {
  const schema = Joi.object({
    name: Joi.string().required(),
    artist: Joi.string().required(),
    duration: Joi.string(),
    genre: Joi.string()
  });
  return schema.validate(song);
}

// Defining port variable
const port = process.env.PORT || 3000;
// App made to listen on specific port
app.listen(port, () => console.log("Listening on port " + port));
