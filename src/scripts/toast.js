import { $ } from "./dom.js";

export const createToast = () => {
    const toast = $("#toast");
    let timer = null;

    return (message) => {
        if (!toast) {
            alert(message);
            return;
        }

        clearTimeout(timer);

        toast.textContent = message;
        toast.classList.add("show");

        timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    };
};