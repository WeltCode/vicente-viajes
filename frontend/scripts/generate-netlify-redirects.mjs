import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const redirectsPath = path.join(publicDir, "_redirects");

const rawTarget = String(process.env.NETLIFY_API_PROXY_TARGET || "").trim();
const normalizedTarget = rawTarget
  ? rawTarget.replace(/\/+$/, "").replace(/\/api$/i, "")
  : "";

const lines = [];

if (normalizedTarget) {
  lines.push(`/api/*  ${normalizedTarget}/api/:splat  200`);
  console.log(`[netlify redirects] Proxy API habilitado -> ${normalizedTarget}/api/:splat`);
} else {
  console.warn(
    "[netlify redirects] NETLIFY_API_PROXY_TARGET no esta definido. /api no sera proxied y el frontend no podra cargar datos remotos en Netlify."
  );
}

lines.push("/*    /index.html   200");

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(redirectsPath, `${lines.join("\n")}\n`, "utf8");