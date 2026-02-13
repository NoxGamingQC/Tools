const BASE_URL = window.BASE_URL || '';
let currentLang = localStorage.getItem("lang") || "fr-ca";
let loadedFiles = {};

async function loadFile(file) {
    if (!loadedFiles[file]) {
        const response = await fetch(`${BASE_URL}/lang/${currentLang}/${file}.json`);
        loadedFiles[file] = await response.json();
    }
}

function getValueFromPath(obj, path) {
    return path.split('.').reduce((o, k) => (o || {})[k], obj);
}

async function trans(key) {
    const [file, ...rest] = key.split(".");
    await loadFile(file);
    let value = getValueFromPath(loadedFiles[file], rest.join('.'));
    return value || key;
}

async function renderTrans() {
    const elements = document.querySelectorAll('[data-trans]');
    for (let el of elements) {
        const key = el.getAttribute('data-trans');
        el.innerText = await trans(key);
    }
}

function setLang(lang) {
    localStorage.setItem("lang", lang);
    location.reload();
}

document.addEventListener('DOMContentLoaded', renderTrans);