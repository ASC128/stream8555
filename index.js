const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
app.use(cors());

// /proxy?url=<真实flv地址>
app.get('/proxy', (req, res) => {
  const url = req.query.url;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send('Invalid URL');
  }

  const headers = {
    'Referer': 'https://pc.784a3.com/',
    'Origin': 'https://pc.784a3.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive'
  };

  console.log(`Proxying: ${url}`);

  req.pipe(request({ url, headers }))
    .on('error', (err) => {
      console.error('Proxy Error:', err.message);
      res.status(500).send('Proxy Failed');
    })
    .pipe(res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ FLV Proxy server running at http://localhost:${port}`);
});
