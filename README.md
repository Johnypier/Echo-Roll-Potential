\# Echo Roll Probability 



A single-page web application for estimating the probability of rolling

specific Echo substats and values in \*\*Wuthering Waves\*\*.



Users can create up to 5 Echo cards (max 12 total cost), select main stats,

substats, and substat values, and see the estimated roll probability for each

Echo in real time.



\---



\## Features



\- \*\*Up to 5 Echo cards\*\* with a hard 12-cost limit

\- \*\*Main stat\*\* selection per cost tier (4 / 3 / 1)

\- \*\*Fixed secondary stat\*\* displayed automatically

\- \*\*Up to 5 substats\*\* per Echo with attribute and value selection

\- \*\*Two probability values\*\* per card:

&#x20; - Substats Roll Probability (attributes only)

&#x20; - Roll Probability With Values (attributes + values)

\- \*\*"Extremely low"\*\* label for probabilities too small to display meaningfully

\- \*\*Session caching\*\* — refreshing the page preserves your current build

\- \*\*Export to PNG\*\* — captures all cards and probabilities as a single image

\- \*\*Light / Dark theme\*\* with persistent preference

\- \*\*Responsive\*\* — works on mobile, tablet, and desktop

\- \*\*About page\*\* with formulas, probability tables, and data sources



\---



\## Project structure



```

├─ index.html Main calculator page

├─ about.html Probability explanation page

├─ README.md This file

├─ src/

│ ├─ scripts/

│ │ ├─ config.js Constants (max echoes, cost, substats)

│ │ ├─ data.js All probability tables (main stats, substats, values)

│ │ ├─ dom.js DOM query helpers ($ and $$)

│ │ ├─ format.js Probability formatting and math utilities

│ │ ├─ probability.js Core probability calculation functions

│ │ ├─ storage.js Session storage (save / load / clear)

│ │ ├─ theme.js Light / dark theme toggle

│ │ ├─ toast.js Warning toast notifications

│ │ ├─ cardApp.js Echo card UI controller

│ │ ├─ exporter.js PNG image export via html2canvas

│ │ └─ main.js Entry point — initializes all modules

│ │

│ └─ styles/

│ ├─ main.css Imports all style modules

│ ├─ tokens.css CSS custom properties (themes)

│ ├─ base.css Global resets and body styles

│ ├─ layout.css Header, navigation, grid, panels

│ ├─ forms.css Select dropdowns and form fields

│ ├─ buttons.css Button styles and variants

│ ├─ cards.css Echo card, substats, probabilities, docs page

│ ├─ export.css Off-screen export wrapper styles

│ └─ utilities.css Loader, toast, animations, responsive queries

```



\---



\## Probability model



\### Substats Roll Probability



$P(\\text{attributes}) = k! \\times \\prod\_{i=0}^{k-1} \\text{select\\\_prob}\[i]$



\- `k` = number of selected substats

\- `select\_prob\[i]` = chance of rolling a specific attribute when `i` substats already exist

\- `k!` accounts for all possible roll orders producing the same final set



\### Roll Probability With Values



$P(\\text{attributes} + \\text{values}) = P(\\text{attributes}) \\times \\prod\_{j=1}^{k} \\text{value\\\_prob}\[j]$



\- `value\_prob\[j]` = chance of rolling the selected value for the j-th substat



\### Display rules



| Probability range (as %) | Displayed as          |

|--------------------------|-----------------------|

| ≥ 1%                     | `X.XX%`              |

| 0.01% – < 1%            | `X.XXXX%`            |

| 0.000001% – < 0.01%     | `X.XXe-X%` (precision)|

| < 0.000001%             | `Extremely low`      |



\---



\## Tech stack



\- \*\*HTML5\*\* — semantic markup, `<template>` elements

\- \*\*CSS3\*\* — custom properties, grid, flexbox, animations

\- \*\*Vanilla JavaScript (ES modules)\*\* — no frameworks or build tools

\- \*\*html2canvas\*\* (CDN) — PNG export

\- \*\*Google Fonts\*\* — Orbitron (titles), Rubik (body)



\---



\## Local development



Use a local server:



```bash

\# Node.js (npx)

npx http-server "your path" -p 5173

```



Then visit the address shown in the terminal, e.g. `http://ip/index.html`.



>Note: ES modules require a server (not file://). Most modern browsers

block module scripts loaded from the file system.



\---



\## License



This project is provided as-is for educational and community use.

Wuthering Waves is a trademark of Kuro Games.

