// server.js
// 【支持 .m3u8 / .flv / 图片 中转】

const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

app.use(cors());

// 中转 GET 请求 (m3u8, ts, flv, png, etc)
app.get('/proxy', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing url');

  // Referer 可根据实际站点调整
  const headers = {
    'Referer': 'https://8dfds.0214104.xyz/',
    'User-Agent': 'Mozilla/5.0'
  };

  request({ url: targetUrl, headers })
    .on('response', (response) => {
      res.set(response.headers);
    })
    .on('error', (err) => {
      res.status(500).send('Proxy error: ' + err.message);
    })
    .pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Proxy server running at http://localhost:${PORT}`);
});
