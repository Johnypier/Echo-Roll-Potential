import { $ } from "./dom.js";
import { MAIN_STATS, SECONDARY_STATS } from "./data.js";
import {
  computeSubstatAttributeProbability,
  computeSubstatValueProbability,
} from "./probability.js";
import { formatProb, formatProbHuman } from "./format.js";

const createEl = (tag, className = "", text = "") => {
  const el = document.createElement(tag);

  if (className) el.className = className;
  if (text) el.textContent = text;

  return el;
};

const getMainStatValue = (cost, mainStatName) => {
  const mainStat = MAIN_STATS[cost]?.find((m) => m.name === mainStatName);

  return mainStat?.value || "—";
};

// 1. Accept `mode` directly as an argument (defaults to "finished")
const createExportCard = (echo, index, mode = "finished") => {
  const card = createEl("article", "echo-card export-card show");

  const cost = Number(echo.cost);
  const secondary = SECONDARY_STATS[cost];

  // 2. Use the passed `mode` directly with your probability functions
  const substatProbability = computeSubstatAttributeProbability(
    echo.substats || [],
    mode,
  );

  const rollProbability = computeSubstatValueProbability(
    echo.substats || [],
    mode,
  );

  const title = createEl("div", "export-card-title", `${cost} Cost`);

  const mainRow = createEl("div", "export-stat-row");
  mainRow.innerHTML = `
    <span>Main Stat</span>
    <strong>${echo.mainStat || "—"} ${getMainStatValue(cost, echo.mainStat)}</strong>
  `;

  const secondaryRow = createEl("div", "export-stat-row");
  secondaryRow.innerHTML = `
    <span>Secondary</span>
    <strong>${secondary.name} ${secondary.value}</strong>
  `;

  const subHead = createEl("div", "export-subhead", "Substats");
  const subList = createEl("div", "export-substats");

  const selectedSubstats = (echo.substats || []).filter((s) => s.attr);

  if (selectedSubstats.length === 0) {
    subList.appendChild(
      createEl("div", "export-substat-row muted", "No substats selected"),
    );
  } else {
    selectedSubstats.forEach((substat) => {
      const row = createEl("div", "export-substat-row");

      const name = createEl("span", "", substat.attr);
      const value = createEl("strong", "", substat.value || "—");

      row.appendChild(name);
      row.appendChild(value);

      subList.appendChild(row);
    });
  }

  const probStack = createEl("div", "prob-stack");

  const p1 = createEl("div", "card-prob");
  p1.innerHTML = `
    <span>Substats Roll Probability</span>
    <strong>${formatProb(substatProbability)}</strong>
  `;

  const p2 = createEl("div", "card-prob");
  p2.innerHTML = `
    <span>Roll Probability With Values</span>
    <strong>${formatProbHuman(rollProbability)}</strong>
  `;

  probStack.appendChild(p1);
  probStack.appendChild(p2);

  card.appendChild(title);
  card.appendChild(mainRow);
  card.appendChild(secondaryRow);
  card.appendChild(subHead);
  card.appendChild(subList);
  card.appendChild(probStack);

  return card;
};

export const initExporter = ({ getState, showWarning }) => {
  const exportBtn = $("#exportBtn");

  if (!exportBtn) return;

  exportBtn.addEventListener("click", async () => {
    const state = getState();

    if (!state.echoes.length) {
      showWarning("Add at least one echo first.");
      return;
    }

    if (typeof html2canvas === "undefined") {
      showWarning("Image export library is not loaded.");
      return;
    }

    // 3. Read mode directly from application state
    const mode = state.mode || "finished";

    const loader = $("#loader");
    loader?.classList.add("active");

    const wrap = createEl("div", "export-wrap");
    wrap.dataset.theme = document.documentElement.dataset.theme;

    const exportHeader = createEl("header", "export-header");

    const title = createEl("h1", "export-title", "Echo Roll Probability");
    exportHeader.appendChild(title);

    // Optional: Displays which mode was used in the exported image header
    const modeBadge = createEl(
      "span",
      "export-mode-badge",
      mode === "finished"
        ? "Calculation Mode: Finished (+25)"
        : "Calculation Mode: Exact Rolls",
    );
    exportHeader.appendChild(modeBadge);

    wrap.appendChild(exportHeader);

    const grid = createEl("div", "cards-grid export-grid");

    // 4. Pass mode into createExportCard
    state.echoes.forEach((echo, index) => {
      grid.appendChild(createExportCard(echo, index, mode));
    });

    wrap.appendChild(grid);

    document.body.appendChild(wrap);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const rootStyles = getComputedStyle(document.documentElement);
      const bg = rootStyles.getPropertyValue("--bg").trim() || "#0e1016";

      const canvas = await html2canvas(wrap, {
        backgroundColor: bg,
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");

      link.download = "echo-roll-build.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error(error);
      showWarning("Export failed. Check the browser console for details.");
    } finally {
      wrap.remove();
      loader?.classList.remove("active");
    }
  });
};
