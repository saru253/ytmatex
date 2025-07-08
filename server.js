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

app.post("/download", (req, res) => {
  const url = req.body.url;
  if (!url) return res.send("❌ Please enter a valid URL");

  const cmd = `yt-dlp -f best -o "/tmp/%(title)s.%(ext)s" "${url}"`;

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error("YT-DLP Error:", err.message);
      console.error(stderr);
      return res.send("❌ Failed to download. yt-dlp may not be working.");
    }
    console.log("Download Output:", stdout);
    res.send("✅ Download started successfully on server!");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
