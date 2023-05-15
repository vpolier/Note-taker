//required packages
const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
// assign database file name to a const variable
const dbFile = "./db/db.json";
const app = express()

// GET Route for home page
app.get("/", (_req, res) =>
  {
    return res.sendFile(path.join(__dirname, "./public/index.html"));
  }
);

//to send back the note.html
app.get("/notes", (_req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// initiate notes router
const notes = express.Router();

// API Route : "GET /api/notes" for retrieving all the notes
notes.get("/", (_req, res) => {
  // read data from file
  fs.readFile(dbFile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      // send data to client
      res.status(200).json(JSON.parse(data))
    }
  })
});
// API Route : "POST /api/notes" for creating new note
notes.post("/", (req, res) => {
    // check if request body is empty
    if (!req.body) {
      res.status(400).send("request body is empty");
    }
    else {
      // read JSON data from file
      fs.readFile(dbFile, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          const { title, text } = req.body;
          // construct newNote to be added to the JSON file
          const newNote = {
            id: uuidv4(), // unique id
            title: title,
            text: text,
          };
          // append new note to the parsed data from JSON file
          const allNotes = JSON.parse(data);
          allNotes.push(newNote);
          // write all the notes back to JSON file
          fs.writeFile(dbFile, JSON.stringify(allNotes, null, 4), (err) => {
            if (err) { 
              console.error(err) ;
              res.status(500).send(err);
            } else {
              console.log(`note appended to ${dbFile}`);
              res.status(200).json(newNote);
            }
          });
        }
      });
    } 
  });
  
  // API Route : "DELETE /api/notes/:id" for deleting a note
  notes.delete("/:id", (req, res) => {
    // get id parameter from the request
    const idToBeDeleted = req.params.id;
    // check if no id passed in
    if (!idToBeDeleted) {
      console.error("id is missing from the request!");
      res.status(400).send("id is missing from the request!");
    } else {
      fs.readFile(dbFile, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          // parse the JSON data from the file
          const allNotes = JSON.parse(data);
          // find the index of the note to be deleted
          const index = allNotes.findIndex(note => note.id === idToBeDeleted);
          // if index is found
          if (index !== -1) {
            // remove note with the found index
            allNotes.splice(index, 1);
            //writeToFile(dbFile, notes);
            //console.log("note deleted sucessfully!");
            //res.status(200).send("note deleted sucessfully!");
            fs.writeFile(dbFile, JSON.stringify(allNotes, null, 4), (err) => {
              if (err) { 
                console.error(err) ;
                res.status(500).send(err);
              } else {
                console.log("note deleted sucessfully!");
                res.status(200).send("note deleted sucessfully!");
              }
            });
  
          }    
          else {
            console.log("id not found");
            res.status(404).send("id not found!");
          }
        }
      });
    }
  });
  
  
  
  module.exports = notes;