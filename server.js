const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

app.use(cors());

app.get("/proxy", (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing url");

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Referer": "https://anym3u8player.com",
    "Origin": "https://anym3u8player.com",
    "Accept": "*/*",
    "Connection": "keep-alive"
  };

  if (targetUrl.includes(".m3u8")) {
    request.get({
      url: targetUrl,
      headers: headers
    }, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        return res.status(500).send("Proxy Failed (m3u8): " + (err?.message || response.statusCode));
      }

      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);
      const fixedBody = body.replace(/^(?!#)(.*\.ts.*)$/gm, line => {
        const full = line.startsWith("http") ? line : baseUrl + line;
        return `/proxy?url=${encodeURIComponent(full)}`;
      });

      res.set("Content-Type", "application/vnd.apple.mpegurl");
      return res.send(fixedBody);
    });

  } else {
    request.get({
      url: targetUrl,
      headers: headers,
      encoding: null
    }, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        return res.status(500).send("Proxy Failed: " + (err?.message || response.statusCode));
      }

      res.set("Content-Type", response.headers["content-type"] || "application/octet-stream");
      return res.send(body);
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy running at http://localhost:${PORT}`);
});
