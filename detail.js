async function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  const container = document.getElementById("detailContent");
  if (!id) {
    container.innerHTML = "<p>Hibás könyv azonosító.</p>";
    return;
  }

  try {
    // 1) KÖNYV KIKERESÉSE: végigolvassuk a page/1..4.json-t és megkeressük az ID-t
    let book = null;
    let lastError = null;

    for (let page = 1; page <= 4; page++) {
      try {
        const res = await fetch(`./api/books/page/${page}.json`);
        if (!res.ok) continue;

        const data = await res.json();
        const found = data.results?.find(b => Number(b.id) === id);

        if (found) {
          book = found;
          break;
        }
      } catch (e) {
        lastError = e;
      }
    }

    if (!book) {
      console.error("Book keresési hiba:", lastError);
      container.innerHTML = "<p>Nem található ilyen könyv.</p>";
      return;
    }

    // 2) ÖSSZEFOGLALÓ BETÖLTÉSE KÜLÖN JSON-BÓL
    let summary = "Összefoglaló még nem elérhető ehhez a könyvhöz.";

    try {
      const summaryRes = await fetch("./api/summaries.json");
      if (summaryRes.ok) {
        const summaries = await summaryRes.json();

        // a kulcsok a JSON-ban stringek ("1", "2"...)
        if (summaries[String(id)]) {
          summary = summaries[String(id)];
        }
      }
    } catch (e) {
      console.error("Summary betöltési hiba:", e);
    }

    // 3) HTML kirajzolás (ugyanaz a layout, ami már bevált)
    container.innerHTML = `
      <div class="detail-wrapper">
        <div class="detail-grid">

          <div class="detail-left">
            <img class="detail-cover" src="${book.cover}" alt="${book.title}">
            <h1 class="detail-title">${book.title}</h1>
            <p><strong>Szerző:</strong> ${book.author}</p>
            <p><strong>Kiadás éve:</strong> ${book.year}</p>
          </div>

          <div class="detail-summary">
            <h2>Rövid összefoglaló</h2>
            <p>${summary}</p>
          </div>

        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Hiba történt a betöltés során.</p>";
  }
}

loadDetail();