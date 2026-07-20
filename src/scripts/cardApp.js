import { $, $$ } from "./dom.js";

import {
    MAIN_STATS,
    SECONDARY_STATS,
    SUBSTAT_ATTRS,
    SUBSTAT_VALUES,
} from "./data.js";

import {
    MAX_ECHOES,
    MAX_COST,
    MAX_SUBSTATS,
    COST_OPTIONS,
} from "./config.js";

import {
    computeSubstatAttributeProbability,
    computeSubstatValueProbability,
} from "./probability.js";

import { formatProb, formatProbHuman, formatOneIn } from "./format.js";

export const createCardApp = ({ showWarning }) => {
    const cardsEl = $("#cards");
    const costInfoEl = $("#costInfo");
    const emptyHintEl = $("#emptyHint");

    const changeHandlers = new Set();

    let suppressChangeEvents = false;

    const getCards = () => $$(".echo-card");

    const emitChange = () => {
        if (suppressChangeEvents) return;

        const state = getState();

        changeHandlers.forEach((handler) => {
            handler(state);
        });
    };

    const onChange = (handler) => {
        changeHandlers.add(handler);
    };

    const getTotalCost = (exceptCard = null) => {
        return getCards().reduce((sum, card) => {
            if (card === exceptCard) return sum;

            return sum + Number($(".cost-select", card).value);
        }, 0);
    };

    const chooseDefaultCost = (remainingCost) => {
        return COST_OPTIONS.find((cost) => cost <= remainingCost) || null;
    };

    const getSelectedSubstats = (card) => {
        return $$(".substat-item", card).map((row) => ({
            attr: $(".substat-attr", row).value,
            value: $(".substat-val", row).value,
        }));
    };

    const getState = () => {
        return {
            version: 1,
            echoes: getCards().map((card) => ({
                cost: Number($(".cost-select", card).value),
                mainStat: $(".main-select", card).value,
                substats: getSelectedSubstats(card),
            })),
        };
    };

    const updateCostOptions = () => {
        getCards().forEach((card) => {
            const select = $(".cost-select", card);
            const otherCost = getTotalCost(card);

            [...select.options].forEach((option) => {
                const optionCost = Number(option.value);

                option.disabled = otherCost + optionCost > MAX_COST;
            });
        });
    };

    const updateAddButton = () => {
        const addBtn = $("#addEchoBtn");

        if (!addBtn) return;

        const remainingCost = MAX_COST - getTotalCost();

        const shouldDisable =
            getCards().length >= MAX_ECHOES || remainingCost < 1;

        addBtn.disabled = shouldDisable;

        if (getCards().length >= MAX_ECHOES) {
            addBtn.title = "Maximum of 5 echo cards reached.";
        } else if (remainingCost < 1) {
            addBtn.title = "Total echo cost limit of 12 reached.";
        } else {
            addBtn.title = "";
        }
    };

    const recalcAll = () => {
        const totalCost = getTotalCost();

        costInfoEl.textContent = `Total Cost: ${totalCost} / ${MAX_COST}`;
        costInfoEl.classList.toggle("over", totalCost > MAX_COST);

        emptyHintEl.style.display = getCards().length ? "none" : "block";

        updateCostOptions();
        updateAddButton();
    };

    const fillMainStats = (card, cost, selectedMainStat = null) => {
        const select = $(".main-select", card);

        select.innerHTML = "";

        MAIN_STATS[cost].forEach((mainStat) => {
            const option = document.createElement("option");

            option.value = mainStat.name;

            // Requirement:
            // no value in the dropdown label.
            option.textContent = mainStat.name;

            option.dataset.val = mainStat.value;

            select.appendChild(option);
        });

        if (
            selectedMainStat &&
            [...select.options].some((option) => option.value === selectedMainStat)
        ) {
            select.value = selectedMainStat;
        }

        updateMainValue(card);
    };

    const updateMainValue = (card) => {
        const select = $(".main-select", card);
        const option = select.selectedOptions[0];

        $(".main-value", card).textContent = option ? option.dataset.val : "—";
    };

    const updateSecondary = (card, cost) => {
        const secondary = SECONDARY_STATS[cost];

        $(".secondary-name", card).textContent = secondary.name;
        $(".secondary-value", card).textContent = secondary.value;
    };

    const fillAttrOptions = (card, row, forcedCurrent = null) => {
        const attrSelect = $(".substat-attr", row);
        const current = forcedCurrent ?? attrSelect.value;

        const selectedInOtherRows = new Set(
            $$(".substat-item", card)
                .filter((otherRow) => otherRow !== row)
                .map((otherRow) => $(".substat-attr", otherRow).value)
                .filter(Boolean)
        );

        attrSelect.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "— attribute —";
        attrSelect.appendChild(placeholder);

        SUBSTAT_ATTRS.forEach((attr) => {
            if (attr !== current && selectedInOtherRows.has(attr)) return;

            const option = document.createElement("option");

            option.value = attr;
            option.textContent = attr;

            attrSelect.appendChild(option);
        });

        if ([...attrSelect.options].some((option) => option.value === current)) {
            attrSelect.value = current;
        } else {
            attrSelect.value = "";
        }
    };

    const updateAllAttrOptions = (card) => {
        $$(".substat-item", card).forEach((row) => {
            fillAttrOptions(card, row);
        });
    };

    const setValueSelectDisplay = (valueSelect, mode = "closed") => {
        [...valueSelect.options].forEach((option) => {
            if (!option.value) {
                option.textContent = "—";
                return;
            }

            const shortText = option.dataset.short || option.value;
            const fullText = option.dataset.full || shortText;

            if (mode === "open") {
                option.textContent = fullText;
                return;
            }

            // Closed state:
            // only the selected option needs the short text.
            // Non-selected options can keep full text for the next open.
            option.textContent = option.selected ? shortText : fullText;
        });
    };

    const refreshValues = (row, preferredValue = null) => {
        const attrSelect = $(".substat-attr", row);
        const valueSelect = $(".substat-val", row);

        const attr = attrSelect.value;
        const table = SUBSTAT_VALUES[attr];

        valueSelect.innerHTML = "";

        if (!attr || !table) {
            const option = document.createElement("option");

            option.value = "";
            option.textContent = "—";

            valueSelect.appendChild(option);
            valueSelect.disabled = true;

            return;
        }

        valueSelect.disabled = false;

        table.forEach((entry) => {
            const option = document.createElement("option");

            const probabilityText = `${(entry.p * 100).toFixed(2)}%`;

            option.value = entry.value;

            // Short text is used when the select is closed.
            option.dataset.short = entry.value;

            // Full text is used while the dropdown is opened.
            option.dataset.full = `${entry.value} (${probabilityText})`;

            option.textContent = option.dataset.full;

            valueSelect.appendChild(option);
        });

        const hasPreferredValue =
            preferredValue &&
            [...valueSelect.options].some((option) => option.value === preferredValue);

        if (hasPreferredValue) {
            valueSelect.value = preferredValue;
        } else if (valueSelect.options.length > 0) {
            valueSelect.value = valueSelect.options[0].value;
        }

        // Important:
        // after the value is selected, collapse the visible text
        // to only the exact value.
        setValueSelectDisplay(valueSelect, "closed");
    };

    const updateSubCount = (card) => {
        const count = $$(".substat-item", card).length;

        $(".sub-count", card).textContent = `${count} / ${MAX_SUBSTATS}`;
        $(".add-substat", card).disabled = count >= MAX_SUBSTATS;
    };

    const updateCardState = (card) => {
        const substats = getSelectedSubstats(card);

        const substatProbability =
            computeSubstatAttributeProbability(substats);

        const rollProbability =
            computeSubstatValueProbability(substats);

        card._state.substatProb = substatProbability;
        card._state.rollProb = rollProbability;

        const substatProbEl = $(".substat-prob-value", card);
        const rollProbEl = $(".roll-prob-value", card);

        substatProbEl.textContent = formatProb(substatProbability);
        rollProbEl.textContent = formatProbHuman(rollProbability);

        substatProbEl.title =
            substatProbability === null
                ? ""
                : `Chance of getting the selected substat attributes. Roughly 1 in ${formatOneIn(substatProbability)}.`;

        rollProbEl.title =
            rollProbability === null
                ? ""
                : `Chance of getting the selected substats with selected values. Roughly 1 in ${formatOneIn(rollProbability)}.`;

        recalcAll();
        emitChange();
    };

    const buildSubstatRow = (card, initialSubstat = null) => {
        const existingCount = $$(".substat-item", card).length;

        if (existingCount >= MAX_SUBSTATS) return;

        const fragment = $("#substatTemplate").content.cloneNode(true);
        const row = fragment.querySelector(".substat-item");

        const attrSelect = $(".substat-attr", row);
        const valueSelect = $(".substat-val", row);

        $(".substat-list", card).appendChild(row);

        fillAttrOptions(card, row, initialSubstat?.attr || "");

        if (initialSubstat?.attr) {
            attrSelect.value = initialSubstat.attr;
        }

        refreshValues(row, initialSubstat?.value || null);
        attrSelect.addEventListener("change", () => {
            refreshValues(row, null);

            updateAllAttrOptions(card);
            updateCardState(card);
        });

        valueSelect.addEventListener("pointerdown", () => {
            setValueSelectDisplay(valueSelect, "open");
        });

        valueSelect.addEventListener("focus", () => {
            setValueSelectDisplay(valueSelect, "open");
        });

        valueSelect.addEventListener("blur", () => {
            setValueSelectDisplay(valueSelect, "closed");
        });

        valueSelect.addEventListener("change", () => {
            setValueSelectDisplay(valueSelect, "closed");
            updateCardState(card);
        });

        $(".remove-substat", row).addEventListener("click", () => {
            row.remove();

            updateSubCount(card);
            updateAllAttrOptions(card);
            updateCardState(card);
        });

        updateAllAttrOptions(card);
        updateSubCount(card);
        updateCardState(card);
    };

    const addEchoCard = (initialEcho = null, options = {}) => {
        const currentCardCount = getCards().length;

        if (currentCardCount >= MAX_ECHOES) {
            if (!options.silent) {
                showWarning("You can create at most 5 echo cards.");
            }

            return false;
        }

        const remainingCost = MAX_COST - getTotalCost();

        if (remainingCost < 1) {
            if (!options.silent) {
                showWarning("Total echo cost limit of 12 reached.");
            }

            return false;
        }

        const requestedCost = Number(initialEcho?.cost || 0);
        const defaultCost = requestedCost || chooseDefaultCost(remainingCost);

        if (!defaultCost || defaultCost > remainingCost) {
            if (!options.silent) {
                showWarning("Cannot add another echo without exceeding 12 total cost.");
            }

            return false;
        }

        const fragment = $("#cardTemplate").content.cloneNode(true);
        const card = fragment.querySelector(".echo-card");

        const costSelect = $(".cost-select", card);

        card._state = {
            substatProb: null,
            rollProb: null,
            previousCost: defaultCost,
        };

        costSelect.value = String(defaultCost);

        const applyCost = (selectedMainStat = null) => {
            const cost = Number(costSelect.value);

            fillMainStats(card, cost, selectedMainStat);
            updateSecondary(card, cost);
            updateCardState(card);
        };

        costSelect.addEventListener("change", () => {
            const requestedCost = Number(costSelect.value);
            const otherCost = getTotalCost(card);

            if (otherCost + requestedCost > MAX_COST) {
                showWarning("That cost would exceed the total limit of 12.");

                costSelect.value = String(card._state.previousCost);

                return;
            }

            card._state.previousCost = requestedCost;

            applyCost();
        });

        $(".main-select", card).addEventListener("change", () => {
            updateMainValue(card);
            emitChange();
        });

        $(".add-substat", card).addEventListener("click", () => {
            buildSubstatRow(card);
        });

        $(".remove-btn", card).addEventListener("click", () => {
            card.classList.add("removing");

            setTimeout(() => {
                card.remove();

                recalcAll();
                emitChange();
            }, 250);
        });

        cardsEl.appendChild(card);

        applyCost(initialEcho?.mainStat || null);

        if (Array.isArray(initialEcho?.substats)) {
            initialEcho.substats.forEach((substat) => {
                buildSubstatRow(card, substat);
            });
        }

        requestAnimationFrame(() => {
            card.classList.add("show");
        });

        recalcAll();
        emitChange();

        return true;
    };

    const restore = (state) => {
        suppressChangeEvents = true;

        cardsEl.innerHTML = "";

        if (Array.isArray(state?.echoes)) {
            state.echoes.forEach((echo) => {
                addEchoCard(echo, { silent: true });
            });
        }

        suppressChangeEvents = false;

        recalcAll();
    };

    $("#addEchoBtn").addEventListener("click", () => {
        addEchoCard();
    });

    return {
        addEchoCard,
        restore,
        getState,
        onChange,
        recalcAll,
    };
};