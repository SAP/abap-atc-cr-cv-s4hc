const fs = require("fs");
const path = require("path");

const contentsPath = path.join(__dirname, "../viewer/src/data");
const files = fs.readdirSync(`${contentsPath}/contents`).filter(fn => fn.endsWith(".json"));

const contentObjects = {};

for (const fileName of files) {
    const cloud = fileName.includes("PCE") || fileName.startsWith("objectClassification") ? "private" : "public";

    contentObjects[fileName] = {
        name: fileName,
        cloud: cloud,
        format: "1"
    }
}

fs.writeFileSync(
    path.join(contentsPath, "contents.json"),
    JSON.stringify(contentObjects, null, 4)
)