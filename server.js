const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000; // The port you want to use

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve audio files from the "audio" folder
const audioDirectory = path.join(__dirname, "audio");

// Endpoint to get a list of audio files from the directory
app.get("/audio-files", (req, res) => {
  fs.readdir(audioDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Unable to read audio files" });
    }
    // Only return audio files (mp3, wav, etc.)
    const audioFiles = files.filter(
      (file) => file.endsWith(".mp3") || file.endsWith(".wav")
    );
    res.json(audioFiles);
  });
});

// Endpoint to serve an audio file
app.get("/audio/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(audioDirectory, fileName);
  res.sendFile(filePath);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
