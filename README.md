# Echo Roll Probability

A web application for estimating the probability of rolling specific Echo substats and values in **Wuthering Waves**. Users can create up to 5 Echo cards (max 12 total cost), select main stats, substats, and substat values, and see the estimated roll probability for each Echo in real time.

**Access:** [GitHub Page](https://johnypier.github.io/Echo-Roll-Potential/index.html)

---

## Features

- **Up to 5 Echo cards** with a hard 12-cost limit
- **Dual Calculation Modes**:
  - **Finished (+25) Mode** _(Default)_: Evaluates the chance of getting your target substats anywhere across all 5 slots of a fully upgraded Echo (hypergeometric distribution).
  - **Exact Rolls Mode**: Evaluates the strict chance that your exact number of rolls landed on those specific stats (+5 to +25).
- **Interactive Tooltip** explaining the currently selected calculation mode
- **Main stat** selection per cost tier (4 / 3 / 1)
- **Fixed secondary stat** displayed automatically
- **Up to 5 substats** per Echo with attribute and value selection
- **Two probability values** per card:
  - Substats Roll Probability (attributes only)
  - Roll Probability With Values (attributes + values)
- **"Extremely low"** label for probabilities too small to display meaningfully
- **Session caching** — refreshing the page preserves your build and active mode
- **Export to PNG** — captures all cards and probabilities as a single image, complete with the active calculation mode badge
- **Light / Dark theme** with persistent preference
- **Responsive** — works on mobile, tablet, and desktop
- **About page** with detailed formulas, mode comparisons, probability tables, and data sources

---

## Project structure

```text
├─ index.html          Main calculator page
├─ about.html          Probability explanation and docs page
├─ README.md           This file
├─ src/
│ ├─ scripts/
│ │ ├─ config.js       Constants (max echoes, cost, substats)
│ │ ├─ data.js         All probability tables (main stats, substats, values)
│ │ ├─ dom.js          DOM query helpers ($ and $$)
│ │ ├─ format.js       Probability formatting and math utilities
│ │ ├─ probability.js  Core probability calculations (Finished vs. Exact)
│ │ ├─ storage.js      Session storage (save / load / clear)
│ │ ├─ theme.js        Light / dark theme toggle
│ │ ├─ toast.js        Warning toast notifications
│ │ ├─ cardApp.js      Echo card UI controller and mode switcher
│ │ ├─ exporter.js     PNG image export via html2canvas
│ │ └─ main.js         Entry point — initializes all modules
│ │
│ └─ styles/
│   ├─ main.css        Imports all style modules
│   ├─ tokens.css      CSS custom properties (themes)
│   ├─ base.css        Global resets and body styles
│   ├─ layout.css      Header, navigation, grid, panels
│   ├─ forms.css       Select dropdowns and form fields
│   ├─ buttons.css     Button styles and variants
│   ├─ cards.css       Echo card, substats, probabilities, docs page
│   ├─ export.css      Off-screen export wrapper styles
│   └─ utilities.css   Loader, toast, animations, responsive queries
```

---

## Probability model

There are **13 possible substat attributes** drawn without replacement. Let **k** be the number of chosen target substats and **N** be the number of total slots considered.

### 1. Substats Roll Probability (Attributes Only)

Both calculation modes use the unified hypergeometric formula:

$$P(\text{attributes}) = \prod_{i=0}^{k-1} \frac{N - i}{13 - i}$$

- **Mode: Finished (+25)** (`N = 5`):  
  Evaluates the chance of your `k` target stats appearing anywhere in the 5 slots of a finished Echo, allowing filler stats in the remaining `5 - k` slots:

  $$P = \frac{\binom{13 - k}{5 - k}}{\binom{13}{5}} = \prod_{i=0}^{k-1} \frac{5 - i}{13 - i}$$

  _(Example: Double Crit has a $\frac{5 \times 4}{13 \times 12} \approx 12.82\%$ chance)._

- **Mode: Exact Rolls** (`N = k`):  
  Evaluates the strict probability of hitting those exact `k` stats across strictly `k` rolls without any filler slots (e.g. +10 with 2 rolls):

  $$P = \frac{1}{\binom{13}{k}} = \prod_{i=0}^{k-1} \frac{k - i}{13 - i}$$

  _(Example: Double Crit in strictly 2 rolls at +10 has a $\frac{2 \times 1}{13 \times 12} \approx 1.28\%$ chance)._

---

### 2. Roll Probability With Values

Once attributes are rolled, their values are rolled independently from attribute-specific discrete distribution tables:

$$P(\text{attributes} + \text{values}) = P(\text{attributes}) \times \prod_{j=1}^{k} \text{value\_prob}[j]$$

- `value_prob[j]` = probability of rolling that specific tier value for the $j$-th attribute.

---

### Display rules

| Probability range (as %) | Displayed as           |
| ------------------------ | ---------------------- |
| ≥ 1%                     | `X.XX%`                |
| 0.01% – < 1%             | `X.XXXX%`              |
| 0.000001% – < 0.01%      | `X.XXe-X%` (precision) |
| < 0.000001%              | `Extremely low`        |

---

## Tech stack

- **HTML5** — semantic markup, `<template>` elements
- **CSS3** — custom properties, grid, flexbox, animations
- **Vanilla JavaScript (ES modules)** — no frameworks or build tools
- **html2canvas** (CDN) — PNG export
- **Google Fonts** — Orbitron (titles), Rubik (body)

---

## Local development

Use a local server (ES modules require an HTTP server rather than opening via `file://`):

```bash
 # Node.js (npx)
npx http-server . -p 5173
```

Then visit the address shown in the terminal (e.g. `http://localhost:5173`).

---

## License

This project is provided as-is for educational and community use. Wuthering Waves is a trademark of Kuro Games.
