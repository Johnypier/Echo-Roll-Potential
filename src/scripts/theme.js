import { $ } from "./dom.js";

const THEME_KEY = "echo-roll-theme";

export const initTheme = () => {
    const themeBtn = $("#themeToggle");

    if (!themeBtn) return;

    const applyTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        themeBtn.textContent = theme === "dark" ? "🌙" : "☀️";
        localStorage.setItem(THEME_KEY, theme);
    };

    themeBtn.addEventListener("click", () => {
        const current = document.documentElement.dataset.theme;
        applyTheme(current === "dark" ? "light" : "dark");
    });

    applyTheme(localStorage.getItem(THEME_KEY) || "dark");
};