import { SELECT_PROB_BY_COUNT, SUBSTAT_VALUES } from "./data.js";
import { factorial } from "./format.js";

export const computeSubstatAttributeProbability = (substats) => {
    const chosen = substats.filter((s) => s.attr);

    if (chosen.length === 0) return null;

    let p = 1;

    for (let i = 0; i < chosen.length; i++) {
        p *= SELECT_PROB_BY_COUNT[i];
    }

    // Order-independent result.
    // Example: CR + CD is counted regardless of which one appeared first.
    p *= factorial(chosen.length);

    return p;
};

export const computeSubstatValueProbability = (substats) => {
    const chosen = substats.filter((s) => s.attr);

    if (chosen.length === 0) return null;

    // If the attribute is selected but value is missing, do not calculate.
    if (chosen.some((s) => !s.value)) return null;

    let p = computeSubstatAttributeProbability(chosen);

    for (const s of chosen) {
        const table = SUBSTAT_VALUES[s.attr] || [];
        const entry = table.find((e) => e.value === s.value);

        p *= entry ? entry.p : 0;
    }

    return p;
};