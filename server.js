const express = require('express');
const path = require('path');
const PORT = 3001;

const app = express();

// Hiddleware for pasing JSON and urlencoded from data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// tell the server look in public folder for extra files the cliente needs
app.use(express.static('public'));

// GET Route for home page
app.get('/', (req, res) =>
    res.sendFile(path.join(_dirname, '/public/index.html'))
);

//to send back the note.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT,()=> {
    console.log ("server is listening")
})
