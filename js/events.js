(function () {
    "use strict";

    const launchButton = document.getElementById("ethical-hacking-event");
    const modal = document.getElementById("event-detail-modal");
    const closeButton = document.getElementById("close-event-modal");

    if (!launchButton || !modal || !closeButton) {
        return;
    }

    const openModal = function () {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeModal = function () {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    launchButton.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });

    if (window.location.hash === "#ethical-hacking-event") {
        openModal();
    }
})();
