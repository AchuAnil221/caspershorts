const fs = require("fs");
const path = require("path");
const { compile } = require("tailwindcss");

function getAllFiles(dir, exts) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractClassCandidates(files) {
  const candidates = new Set();
  const tokenRegex = /[a-zA-Z0-9_\-\/:\.\[\]#%]+/g;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    // Extract className="..." and className={`...`} and cn(...)
    const matches = content.match(tokenRegex) || [];
    for (const match of matches) {
      if (match.length > 1 && !match.startsWith("//") && !match.startsWith("/*")) {
        candidates.add(match);
      }
    }
  }

  return Array.from(candidates);
}

async function buildCSS() {
  console.log("Scanning src/ for Tailwind classes...");
  const files = getAllFiles(path.resolve(__dirname, "../src"), [".tsx", ".ts", ".jsx", ".js"]);
  const candidates = extractClassCandidates(files);
  console.log(`Found ${candidates.length} candidate tokens across ${files.length} files.`);

  console.log("Compiling with Tailwind v4...");
  const compiler = await compile('@import "tailwindcss";', {
    loadStylesheet: async (id, base) => {
      let filePath = id;
      if (id === "tailwindcss") {
        filePath = path.resolve(__dirname, "../node_modules/tailwindcss/index.css");
      } else if (id.startsWith(".")) {
        filePath = path.resolve(base, id);
      } else {
        filePath = path.resolve(__dirname, "../node_modules", id);
      }
      return {
        content: fs.readFileSync(filePath, "utf-8"),
        base: path.dirname(filePath),
      };
    },
  });

  const generatedCss = compiler.build(candidates);

  const customStyles = `
/* Custom CSS Variables & Base Styles — Strictly Light Theme */
:root {
  color-scheme: light !important;
  --background: #ffffff;
  --foreground: #09090b;
}

html, body {
  color-scheme: light !important;
  background-color: #ffffff !important;
  color: #09090b !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

* {
  box-sizing: border-box;
}
`;

  const finalCss = generatedCss + "\n" + customStyles;
  const outputPath = path.resolve(__dirname, "../src/app/globals.css");
  fs.writeFileSync(outputPath, finalCss, "utf-8");
  console.log(`Successfully generated globals.css (${(finalCss.length / 1024).toFixed(1)} KB)`);
}

buildCSS().catch((err) => {
  console.error("Build CSS failed:", err);
  process.exit(1);
});

