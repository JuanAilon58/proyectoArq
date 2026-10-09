const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".json": "application/json",
};
http
  .createServer((req, res) => {
    let target;
    try {
      target = path.resolve(
        root,
        "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
      );
    } catch {
      res.writeHead(400);
      return res.end("Ruta no válida");
    }
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(403);
      return res.end("Acceso no permitido");
    }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory())
      target = path.join(target, "index.html");
    fs.readFile(target, (error, body) => {
      if (error) {
        res.writeHead(404);
        return res.end("No encontrado");
      }
      res.writeHead(200, {
        "Content-Type":
          types[path.extname(target)] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(body);
    });
  })
  .listen(port, "127.0.0.1", () =>
    console.log("Álbum Tecnológico: http://127.0.0.1:" + port),
  );
