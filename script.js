const booksContainer = document.getElementById("books");
if (!booksContainer) {
  // Nem a könyvlista oldalon vagyunk (pl. index/about), nincs teendő.
} else {
  // ide jön a meglévő kódod (loadBooks + main)
}

function getPageFromUrl() {
  const url = new URL(window.location.href);
  const p = Number(url.searchParams.get("page") || "1");
  return Number.isFinite(p) && p >= 1 ? p : 1;
}

function setPageInUrl(page) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(page));
  window.location.href = url.toString();
}

async function loadBooks(page) {
  const response = await fetch(`./api/books/page/${page}.json`);
  if (!response.ok) throw new Error(`Nem találom: page/${page}.json (${response.status})`);
  const data = await response.json();

const container = document.getElementById("books");

container.innerHTML = data.results.map((book) => `
  <div class="card">
    <img src="${book.cover}" alt="${book.title}">
    <div class="title">${book.title}</div>

    <a class="details-btn" href="detail.html?id=${book.id}">
      Részletek
    </a>
  </div>
`).join("");

  // pagination UI
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");

  pageInfo.textContent = `Page ${page} / ${data.info.pages}`;

  prevBtn.disabled = data.info.prev === null;
  nextBtn.disabled = data.info.next === null;

  prevBtn.onclick = () => setPageInUrl(data.info.prev);
  nextBtn.onclick = () => setPageInUrl(data.info.next);
}

(async function main() {
  try {
    const page = getPageFromUrl();
    await loadBooks(page);
  } catch (e) {
    console.error(e);
    alert("Hiba történt a könyvek betöltése közben. Nézd meg a konzolt.");
  }
})();