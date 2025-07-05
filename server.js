const express = require('express');
const request = require('request'); // 注意使用旧版 request 模块
const cors = require('cors');
const app = express();

app.use(cors());

app.get("/proxy", (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing url");

  const headers = {
    "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
    "Referer": "https://anym3u8player.com", // 可以替换成其他来源页
    "Origin": "https://anym3u8player.com"
  };

  request.get({
    url: targetUrl,
    headers: headers,
    encoding: null, // 保证返回 Buffer
  }, (err, response, body) => {
    if (err) {
      return res.status(500).send("Proxy Failed: " + err.message);
    }

    res.set("Content-Type", response.headers["content-type"] || "application/octet-stream");
    res.send(body);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy running at http://localhost:${PORT}`);
});
