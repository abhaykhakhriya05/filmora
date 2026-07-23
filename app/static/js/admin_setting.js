document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("saveAdminSettings");
    const form = document.getElementById("adminSettingForm");
    const toast = document.getElementById("adminSettingToast");

    const showToast = () => {
        if (!toast) {
            return;
        }

        toast.classList.add("is-visible");
        window.setTimeout(() => {
            toast.classList.remove("is-visible");
        }, 2200);
    };

    if (saveButton) {
        saveButton.addEventListener("click", () => {
            if (form && !form.reportValidity()) {
                return;
            }

            showToast();
        });
    }
});
