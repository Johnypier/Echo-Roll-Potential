import { SUBSTAT_VALUES } from "./data.js";

const TOTAL_POOL = 13;
const MAX_SLOTS = 5;

/**
 * @param {Array} substats - Array of { attr, value }
 * @param {"finished"|"exact"} mode - "finished" (+25 echo, 5 slots) or "exact" (k slots)
 */
export const computeSubstatAttributeProbability = (
  substats,
  mode = "exact",
) => {
  const chosen = substats.filter((s) => s.attr);
  const k = chosen.length;

  if (k === 0 || k > MAX_SLOTS) return null;

  // "finished" assumes 5 total rolls; "exact" assumes exactly k rolls
  const totalSlots = mode === "finished" ? MAX_SLOTS : k;

  let p = 1;
  for (let i = 0; i < k; i++) {
    p *= (totalSlots - i) / (TOTAL_POOL - i);
  }

  return p;
};

export const computeSubstatValueProbability = (substats, mode = "exact") => {
  const chosen = substats.filter((s) => s.attr);

  if (chosen.length === 0 || chosen.length > MAX_SLOTS) return null;
  if (chosen.some((s) => !s.value)) return null;

  let p = computeSubstatAttributeProbability(chosen, mode);
  if (p === null) return null;

  for (const s of chosen) {
    const table = SUBSTAT_VALUES[s.attr] || [];
    const entry = table.find((e) => e.value === s.value);

    p *= entry ? entry.p : 0;
  }

  return p;
};
