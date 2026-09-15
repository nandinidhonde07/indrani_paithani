import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// Ensure dist bundle is up to date on server start
const distIndexPath = path.join(DIST_DIR, 'index.html');
const rootIndexPath = path.join(__dirname, 'index.html');

try {
  let needBuild = !fs.existsSync(distIndexPath);
  if (!needBuild && fs.existsSync(rootIndexPath)) {
    const rootContent = fs.readFileSync(rootIndexPath, 'utf8');
    const distContent = fs.readFileSync(distIndexPath, 'utf8');
    const rootVerMatch = rootContent.match(/build-version"\s+content="([^"]+)"/);
    const distVerMatch = distContent.match(/build-version"\s+content="([^"]+)"/);
    if (rootVerMatch && distVerMatch && rootVerMatch[1] !== distVerMatch[1]) {
      console.log(`[Auto-Build] Version mismatch (Root: ${rootVerMatch[1]} vs Dist: ${distVerMatch[1]}). Rebuilding...`);
      needBuild = true;
    }
  }
  if (needBuild) {
    console.log('[Auto-Build] Building production bundle via Vite...');
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('[Auto-Build] Production bundle build complete!');
  }
} catch (err) {
  console.warn('[Auto-Build Note]:', err.message);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);

  // Security check to prevent path traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    let targetFile = filePath;
    if (err || !stats.isFile()) {
      // Single Page Application (SPA) Fallback
      targetFile = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(targetFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(targetFile, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('500 Internal Server Error');
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Indrani Paithani web server running on port ${PORT}`);
});
