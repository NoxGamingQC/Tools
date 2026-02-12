let currentLang = localStorage.getItem("lang") || "fr";
let loadedFiles = {};

async function loadFile(file) {
    if (!loadedFiles[file]) {
        const response = await fetch(`/lang/${currentLang}/${file}.json`);
        loadedFiles[file] = await response.json();
    }
}

async function trans(key) {
    const [file, ...rest] = key.split(".");
    const path = rest.join(".");

    await loadFile(file);

    let value = loadedFiles[file];

    for (let segment of rest) {
        if (!value[segment]) {
            return key;
        }
        value = value[segment];
    }

    return value;
}

function setLang(lang) {
    localStorage.setItem("lang", lang);
    location.reload();
}