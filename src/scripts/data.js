/* ============================================================
   DATA MODULE
   ============================================================ */

// Main stat options per cost. { name, value }
export const MAIN_STATS = {
    4: [
        { name: "Crit Rate", value: "22%" },
        { name: "Crit Damage", value: "44%" },
        { name: "HP%", value: "33%" },
        { name: "ATK%", value: "33%" },
        { name: "DEF%", value: "41.5%" },
        { name: "Healing Bonus", value: "26%" },
    ],
    3: [
        { name: "HP%", value: "30%" },
        { name: "ATK%", value: "30%" },
        { name: "DEF%", value: "38%" },
        { name: "Glacio DMG Bonus", value: "30%" },
        { name: "Fusion DMG Bonus", value: "30%" },
        { name: "Aero DMG Bonus", value: "30%" },
        { name: "Electro DMG Bonus", value: "30%" },
        { name: "Spectro DMG Bonus", value: "30%" },
        { name: "Havoc DMG Bonus", value: "30%" },
        { name: "Energy Regen", value: "32%" },
    ],
    1: [
        { name: "HP%", value: "22.8%" },
        { name: "ATK%", value: "18%" },
        { name: "DEF%", value: "18%" },
    ],
};

// Secondary (fixed) stat per cost.
export const SECONDARY_STATS = {
    4: { name: "ATK", value: "150" },
    3: { name: "ATK", value: "100" },
    1: { name: "HP", value: "2280" },
};

// The 13 available substat attributes.
export const SUBSTAT_ATTRS = [
    "HP",
    "DEF",
    "HP%",
    "ATK%",
    "ATK",
    "DEF%",
    "Basic ATK",
    "Heavy ATK",
    "Res Skill",
    "Res Lib",
    "CR",
    "CD",
    "ER",
];

// Probability (as fraction) of selecting a SPECIFIC attribute
// given the number of substats already on the echo (index = count).
export const SELECT_PROB_BY_COUNT = [
    0.076923, // 0 substats
    0.083333, // 1 substat
    0.090909, // 2 substats
    0.100000, // 3 substats
    0.111111, // 4 substats
];

// Shared value table for %-scaling attributes.
export const SHARED_PERCENT = [
    { value: "6.40%", p: 0.0680 },
    { value: "7.10%", p: 0.0777 },
    { value: "7.90%", p: 0.2039 },
    { value: "8.60%", p: 0.2427 },
    { value: "9.40%", p: 0.1748 },
    { value: "10.10%", p: 0.1456 },
    { value: "10.90%", p: 0.0583 },
    { value: "11.60%", p: 0.0291 },
];

// Value tables per attribute: array of { value, p }.
export const SUBSTAT_VALUES = {
    "HP%": SHARED_PERCENT,
    "ATK%": SHARED_PERCENT,
    "Res Skill": SHARED_PERCENT,
    "Res Lib": SHARED_PERCENT,
    "Basic ATK": SHARED_PERCENT,
    "Heavy ATK": SHARED_PERCENT,

    "HP": [
        { value: "320", p: 0.0680 },
        { value: "360", p: 0.0777 },
        { value: "390", p: 0.2039 },
        { value: "430", p: 0.2427 },
        { value: "470", p: 0.1748 },
        { value: "510", p: 0.1456 },
        { value: "540", p: 0.0583 },
        { value: "580", p: 0.0291 },
    ],

    "DEF": [
        { value: "40", p: 0.1456 },
        { value: "50", p: 0.4466 },
        { value: "60", p: 0.3204 },
        { value: "70", p: 0.0874 },
    ],

    "ATK": [
        { value: "30", p: 0.0680 },
        { value: "40", p: 0.5243 },
        { value: "50", p: 0.3786 },
        { value: "60", p: 0.0291 },
    ],

    "DEF%": [
        { value: "8.10%", p: 0.0680 },
        { value: "9.00%", p: 0.0777 },
        { value: "10.00%", p: 0.2039 },
        { value: "10.90%", p: 0.2427 },
        { value: "11.80%", p: 0.1748 },
        { value: "12.80%", p: 0.1456 },
        { value: "13.80%", p: 0.0583 },
        { value: "14.70%", p: 0.0291 },
    ],

    "ER": [
        { value: "6.80%", p: 0.0680 },
        { value: "7.60%", p: 0.0777 },
        { value: "8.40%", p: 0.2039 },
        { value: "9.20%", p: 0.2427 },
        { value: "10.00%", p: 0.1748 },
        { value: "10.80%", p: 0.1456 },
        { value: "11.60%", p: 0.0583 },
        { value: "12.40%", p: 0.0291 },
    ],

    "CR": [
        { value: "6.30%", p: 0.2333 },
        { value: "6.90%", p: 0.2333 },
        { value: "7.50%", p: 0.2333 },
        { value: "8.10%", p: 0.0800 },
        { value: "8.70%", p: 0.0800 },
        { value: "9.30%", p: 0.0800 },
        { value: "9.90%", p: 0.0300 },
        { value: "10.50%", p: 0.0300 },
    ],

    "CD": [
        { value: "12.60%", p: 0.2333 },
        { value: "13.80%", p: 0.2333 },
        { value: "15.00%", p: 0.2333 },
        { value: "16.20%", p: 0.0800 },
        { value: "17.40%", p: 0.0800 },
        { value: "18.60%", p: 0.0800 },
        { value: "19.80%", p: 0.0300 },
        { value: "21.00%", p: 0.0300 },
    ],
};