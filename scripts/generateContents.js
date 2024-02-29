const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../viewer/src/data");
const contentsPath = dataPath + "/contents";

const srcPath = path.join(__dirname, "../src");

if (fs.existsSync(dataPath)) {
    fs.rmSync(dataPath, {
        recursive: true
    });
}

fs.mkdirSync(contentsPath, {
    recursive: true
})

const contentObjects = {};
const srcFiles = fs.readdirSync(srcPath);

srcFiles.forEach(file => {
    if (path.extname(file) === '.json') {
        const cloud = file.includes("PCE") || file.startsWith("objectClassification") ? "private" : "public";

        contentObjects[file] = {
            name: file,
            cloud: cloud,
            format: "1"
        }

        fs.copyFileSync(path.join(srcPath, file), path.join(contentsPath, file));
    }
});

fs.writeFileSync(
    path.join(dataPath, "contents.json"),
    JSON.stringify(contentObjects, null, 4)
)