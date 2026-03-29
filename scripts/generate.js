const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const gamesDir = path.join(rootDir, "games");
const outputFile = path.join(rootDir, "data", "games.json");

if (!fs.existsSync(gamesDir)) {
  console.log("games directory not found");
  process.exit(0);
}

const result = fs
  .readdirSync(gamesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const dir = entry.name;
    const gameDir = path.join(gamesDir, dir);
    const metaPath = path.join(gameDir, "meta.json");
    const indexPath = path.join(gameDir, "index.html");

    if (!fs.existsSync(indexPath)) {
      return null;
    }

    let meta = {};

    if (fs.existsSync(metaPath)) {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    }

    const thumbnailPath = meta.thumbnail
      ? path.join(gameDir, meta.thumbnail)
      : null;

    return {
      title: meta.title || dir,
      description: meta.description || "",
      thumbnail:
        thumbnailPath && fs.existsSync(thumbnailPath)
          ? `games/${dir}/${meta.thumbnail}`
          : "",
      url: `games/${dir}/`,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.title.localeCompare(b.title, "ja"));

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

console.log(`✅ games.json generated (${result.length} games)`);
