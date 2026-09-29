import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json" };

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const file = normalize(join(root, pathname === "/" ? "index.html" : pathname));
  if (!file.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const content = await readFile(file);
    response.writeHead(200, { "Content-Type": `${types[extname(file)] ?? "application/octet-stream"}; charset=utf-8` });
    response.end(content);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(4173, () => console.log("Fleet dashboard: http://localhost:4173"));