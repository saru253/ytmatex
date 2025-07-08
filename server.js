const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/download', (req, res) => {
  const url = req.body.url;
  if (!url) return res.send("❌ Please enter a valid URL");

  const cmd = `yt-dlp -o "/tmp/%(title)s.%(ext)s" ${url}`;
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(err.message);
      return res.send("❌ Failed to download. yt-dlp may not be working.");
    }
    console.log(stdout);
    res.send("✅ Download started! (Check Render logs to confirm)");
  });
});
