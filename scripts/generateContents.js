const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../viewer/src/data");
const contentsPath = dataPath + "/contents";

const srcPath = path.join(__dirname, "../src");

const editionS4Public = "s4public";
const editionS4Private = "s4private";
const editionBTP = "btp";

if (fs.existsSync(dataPath)) {
    fs.rmSync(dataPath, {
        recursive: true
    });
}

fs.mkdirSync(contentsPath, {
    recursive: true
})

const contentObjects = {
    [editionS4Public]: [],
    [editionS4Private]: [],
    [editionBTP]: []
};
const srcFiles = fs.readdirSync(srcPath);

srcFiles.forEach(file => {
    if (path.extname(file) === '.json') {
        const type = file.includes("objectClassifications") ? "classicAPIs" : "releasedAPIs";
        if (type === "classicAPIs") return

        const edition = getEdition(file);
        const release = getRelease(edition, file);

        contentObjects[edition].push({
            filename: file,
            release: release || "Latest",
        });

        fs.copyFileSync(path.join(srcPath, file), path.join(contentsPath, file));
    }
});

fs.copyFileSync(
    path.join(srcPath, "objectClassifications_SAP.json"),
    path.join(contentsPath, "objectClassifications_SAP.json")
);

fs.writeFileSync(
    path.join(dataPath, "contents.json"),
    JSON.stringify(contentObjects, null, 4)
)

function getRelease(edition, filename) {
    if (edition === editionS4Private) {
        // Matches e.g. objectReleaseInfo_PCE2022_1.json
        const match = filename.match(/objectReleaseInfo_PCE(\d{4})(?:_(\d+))?/);
        if (match) {
            const year = Number.parseInt(match[1]);
            const servicePack = Number.parseInt(match[2]) || 0;
            return year + " SP" + servicePack;
        }
    } else if (edition === editionS4Public) {
        // Matches e.g. objectReleaseInfo_2308.json
        const match = filename.match(/objectReleaseInfo_(\d{4})/);
        if (match) {
            return match[1];
        }
    }
}

function getEdition(filename) {
    if (filename.includes("objectReleaseInfo_BTP")) {
        return editionBTP;
    } else if (filename.includes("objectReleaseInfo_PCE")) {
        return editionS4Private;
    } else if (filename.includes("objectReleaseInfo")) {
        return editionS4Public
    } else {
        return "unknown";
    }
}