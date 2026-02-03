export function initRouter() {
  const content = document.getElementById("content");

  async function loadPage(page) {
    const res = await fetch(`/app/pages/${page}.php`);
    if (!res.ok) {
      content.innerHTML = "<h2>Página no encontrada</h2>";
      return;
    }
    content.innerHTML = await res.text();
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-link]");
    if (!link) return;

    e.preventDefault();
    const page = link.getAttribute("href").replace("/", "");
    history.pushState({}, "", link.href);
    loadPage(page);
  });

  window.addEventListener("popstate", () => {
    const page = location.pathname.replace("/", "") || "home";
    loadPage(page);
  });
}
