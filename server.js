const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;
const db = require("./db/db.json");
const crypto = require("crypto");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  req.body.id = crypto.randomBytes(4).toString("hex");
  db.push(req.body);
  fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
    if (err) throw err;
    console.log("Saved!");
  });
  res.json(db);
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  for (let i = 0; i < db.length; i++) {
    if (db[i].id === noteId) {
      db.splice(i, 1);
    }
  }
  fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
    if (err) throw err;
    console.log("Saved!");
    res.json(db);
  });
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));