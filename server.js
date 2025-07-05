const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // 如果是 Node 18+ 可省略此行
const app = express();

app.use(cors());

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing url");

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type");

    // ✅ 如果是 .m3u8，则将 ts 路径也代理化
    if (contentType && contentType.includes("application/vnd.apple.mpegurl")) {
      const text = await response.text();
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);

      const fixed = text.replace(/^(?!#)(.*\.ts.*)$/gm, line => {
        const realUrl = line.startsWith("http") ? line : baseUrl + line;
        return `/proxy?url=${encodeURIComponent(realUrl)}`;
      });

      res.set("Content-Type", "application/vnd.apple.mpegurl");
      return res.send(fixed);
    }

    // ✅ 其他类型直接中转二进制
    const buffer = await response.arrayBuffer();
    res.set("Content-Type", contentType || "application/octet-stream");
    return res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("❌ Proxy error:", err.message);
    return res.status(500).send("Proxy error: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running: http://localhost:${PORT}`);
});
