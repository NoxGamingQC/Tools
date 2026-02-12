document.addEventListener("DOMContentLoaded", async () => {
    let path = location.pathname.endsWith("/") ? location.pathname + "index.html" : location.pathname;

    // Lire la page
    let pageHtml;
    try {
        const resp = await fetch(path);
        if (!resp.ok) throw new Error("Page not found");
        pageHtml = await resp.text();
    } catch {
        document.body.innerHTML = "<h1>404 - Page non trouvée</h1>";
        return;
    }

    // Layout
    const layoutMatch = pageHtml.match(/@layout\(['"](.+?)['"]\)/);
    if (!layoutMatch) return console.error("Layout non trouvé !");
    const layoutFile = "/" + layoutMatch[1] + ".html";

    let layoutHtml;
    try {
        const resp = await fetch(layoutFile);
        layoutHtml = await resp.text();
    } catch {
        document.body.innerHTML = "<h1>Erreur : Layout manquant</h1>";
        return;
    }

    // Sections
    const sectionMatch = /@section\(['"]content['"]\)([\s\S]*?)@endsection/.exec(pageHtml);
    const content = sectionMatch ? sectionMatch[1].trim() : "";

    // Injecter le contenu
    layoutHtml = layoutHtml.replace(/@yield\(['"]content['"]\)/, content);

    document.body.innerHTML = layoutHtml;
});