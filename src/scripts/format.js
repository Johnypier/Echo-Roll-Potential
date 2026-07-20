export const factorial = (n) => {
    let result = 1;

    for (let i = 2; i <= n; i++) {
        result *= i;
    }

    return result;
};

export const formatProb = (p) => {
    if (p === null || p === undefined) return "—";
    if (p <= 0) return "0%";

    const pct = p * 100;

    if (pct < 0.000001) return `${pct.toExponential(3)}%`;
    if (pct < 0.01) return `${pct.toPrecision(3)}%`;
    if (pct < 1) return `${pct.toFixed(4)}%`;

    return `${pct.toFixed(2)}%`;
};

export const formatProbHuman = (p) => {
    if (p === null || p === undefined) return "—";
    if (p <= 0) return "0%";

    const pct = p * 100;

    if (pct < 0.000001) return "Extremely low";
    if (pct < 0.01) return `${pct.toPrecision(3)}%`;
    if (pct < 1) return `${pct.toFixed(4)}%`;

    return `${pct.toFixed(2)}%`;
};

export const formatOneIn = (p) => {
    if (!p || p <= 0) return "∞";

    const n = 1 / p;

    if (!Number.isFinite(n)) return "too large to display";
    if (n >= 1e12) return n.toExponential(3);

    return Math.round(n).toLocaleString();
};