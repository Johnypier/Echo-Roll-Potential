const STORAGE_KEY = "echo-roll-calculator-session-v1";

export const saveSession = (state) => {
    try {
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                ...state,
                savedAt: Date.now(),
            })
        );
    } catch (error) {
        console.warn("Failed to save session state:", error);
    }
};

export const loadSession = () => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);

        if (!raw) return null;

        return JSON.parse(raw);
    } catch (error) {
        console.warn("Failed to load session state:", error);
        return null;
    }
};

export const clearSession = () => {
    sessionStorage.removeItem(STORAGE_KEY);
};