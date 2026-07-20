import { initTheme } from "./theme.js";
import { createToast } from "./toast.js";
import { createCardApp } from "./cardApp.js";
import { initExporter } from "./exporter.js";
import { loadSession, saveSession } from "./storage.js";
import { $ } from "./dom.js";
import { SUBSTAT_ATTRS, SUBSTAT_VALUES } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
    initTheme();

    const showWarning = createToast();

    // Useful diagnostic after you changed attribute names to short labels.
    const missingValueTables = SUBSTAT_ATTRS.filter(
        (attr) => !SUBSTAT_VALUES[attr]
    );

    if (missingValueTables.length > 0) {
        console.warn(
            "These substat attributes do not have matching value tables:",
            missingValueTables
        );
    }

    const app = createCardApp({ showWarning });

    app.onChange((state) => {
        saveSession(state);
    });

    const savedState = loadSession();

    if (savedState?.echoes?.length) {
        app.restore(savedState);
    } else {
        app.recalcAll();
    }

    initExporter({
        getState: app.getState,
        showWarning,
    });

    $("#loader")?.classList.remove("active");
});