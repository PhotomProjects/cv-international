import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const PORT = 4173;

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".pdf": "application/pdf"
};

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] ?? "application/octet-stream";
}

function safeResolveFromDist(urlPath) {
    const cleanPath = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
    const normalizedPath = cleanPath === "/" ? "/index.html" : cleanPath;
    const resolvedPath = path.normalize(path.join(DIST, normalizedPath));

    if (!resolvedPath.startsWith(DIST)) {
        return null;
    }

    return resolvedPath;
}

async function resolveFilePath(urlPath) {
    let filePath = safeResolveFromDist(urlPath);
    if (!filePath) return null;

    try {
        const fileStat = await stat(filePath);
        
        if (fileStat.isDirectory()) {
        filePath = path.join(filePath, "index.html");
        await stat(filePath);
        }

        return filePath;
    } catch {
        try {
            const fallbackPath = safeResolveFromDist(path.join(urlPath, "index.html"));
            if (!fallbackPath) return null;

            await stat(fallbackPath);
            return fallbackPath;
        } catch {
            return null;
        }
    }
}

const server = http.createServer(async (req, res) => {
    try {
        const filePath = await resolveFilePath(req.url || "/");
        if (!filePath) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 Not Found");
            return;
        }
        const content = await readFile(filePath);
        res.writeHead(200, { "Content-Type": getContentType(filePath) });
        res.end(content);
    } catch (error) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("500 Internal Server Error");
        console.error(error);
    }
});


server.listen(PORT, () => {
    console.log(`Preview server running at http://localhost:${PORT}`);
});