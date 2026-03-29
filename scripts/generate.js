const fs = require("fs");
const path = require("path");

const gamesDir = "games";
const outputFile = "data/games.json";

const result = [];

if (!fs.existsSync(gamesDir)) {
  console.log("games directory not found");
  process.exit(0);
}

const dirs = fs.readdirSync(gamesDir);

dirs.forEach(dir => {
  const metaPath = path.join(gamesDir, dir, "meta.json");

  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    result.push({
      title: meta.title || dir,
      description: meta.description || "",
      thumbnail: `/games/${dir}/${meta.thumbnail || ""}`,
      url: `/games/${dir}/`
    });
  }
});

fs.mkdirSync(path.join(__dirname, "../data"), { recursive: true });

fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

console.log("✅ games.json generated");
