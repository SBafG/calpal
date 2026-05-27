// ============================================================
// stamp-cache-version.js
// Stämplar en cache-bust-version (commit-SHA) på alla lokala
// JS-importer + index.html:s script/CSS-länkar. Körs i CI INNAN
// Pages-deploy så att varje deploy får unika URL:er och nya
// versioner alltid slår igenom — utan hård-refresh.
//
// Källkoden i repot lämnas oförändrad i normalfallet (CI-checkout
// är tillfällig). Skriptet är idempotent: byter ut ev. ?v=… mot ny.
// ============================================================

import { readdir, readFile, writeFile } from "fs/promises";

const VER = (process.env.GITHUB_SHA || Date.now().toString(36)).slice(0, 8);

async function stampJsImports() {
  const files = (await readdir("js")).filter(f => f.endsWith(".js"));
  for (const f of files) {
    const path = `js/${f}`;
    let src = await readFile(path, "utf8");
    const before = src;
    // statiska importer:  from "./x.js"
    src = src.replace(
      /(from\s*["'])(\.\.?\/[^"']+?\.js)(\?v=[^"']*)?(["'])/g,
      (_, a, p, _v, b) => `${a}${p}?v=${VER}${b}`
    );
    // dynamiska importer:  import("./x.js")
    src = src.replace(
      /(import\(\s*["'])(\.\.?\/[^"']+?\.js)(\?v=[^"']*)?(["']\s*\))/g,
      (_, a, p, _v, b) => `${a}${p}?v=${VER}${b}`
    );
    if (src !== before) { await writeFile(path, src); }
  }
}

async function stampIndexHtml() {
  let html = await readFile("index.html", "utf8");
  html = html
    .replace(/(src="js\/main\.js)(\?v=[^"]*)?"/g, `$1?v=${VER}"`)
    .replace(/(href="css\/[^"?]+\.css)(\?v=[^"]*)?"/g, `$1?v=${VER}"`);
  await writeFile("index.html", html);
}

async function main() {
  await stampJsImports();
  await stampIndexHtml();
  console.log(`Stämplade cache-version v=${VER} på JS-importer och index.html`);
}

main().catch(err => { console.error(err); process.exit(1); });
