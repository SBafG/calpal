// ============================================================
// theme.js — växla mellan Himmel (default) och Almanacka
// ============================================================

const KEY = "calpal:theme";

export function initTheme() {
  const saved = localStorage.getItem(KEY);
  // default = "blue" (himmel)
  applyTheme(saved === "warm" ? "warm" : "blue");

  document.querySelectorAll("[data-theme-set]").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.getAttribute("data-theme-set");
      applyTheme(t);
      localStorage.setItem(KEY, t);
    });
  });
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "warm") {
    root.setAttribute("data-theme", "warm");
  } else {
    root.removeAttribute("data-theme");
  }
  document.querySelectorAll("[data-theme-set]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-theme-set") === theme);
  });
}
