const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url || !url.startsWith('http')) {
    return res.status(400).send('Invalid URL');
  }

  req.pipe(request({
    url,
    headers: {
      'Referer': 'https://pc.784a3.com/',
      'User-Agent': 'Mozilla/5.0'
    }
  })).pipe(res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
