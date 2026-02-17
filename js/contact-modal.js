/* ===============================
   SHARED CONTACT MODAL + PAGE
   =============================== */

(function () {
    "use strict";

    const EMAILJS_CONFIG = {
        serviceId: "service_dt1zonl",
        templateId: "template_ajzrxrg",
        publicKey: "c3vecK0SfFsvMh65n"
    };

    function ensureEmailJsLoaded() {
        return new Promise(function (resolve, reject) {
            if (window.emailjs) {
                resolve(window.emailjs);
                return;
            }

            const existing = document.querySelector('script[data-emailjs-sdk="1"]');
            if (existing) {
                existing.addEventListener("load", function () { resolve(window.emailjs); });
                existing.addEventListener("error", reject);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
            script.async = true;
            script.dataset.emailjsSdk = "1";
            script.onload = function () { resolve(window.emailjs); };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function ensureModal() {
        if (document.getElementById("contact-modal")) {
            return;
        }

        const modal = document.createElement("div");
        modal.id = "contact-modal";
        modal.className = "modal-overlay";
        modal.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="text-2xl font-bold">Contact Us</h2>
            <button id="close-contact-modal" class="text-3xl text-ghmuted hover:text-white" aria-label="Close contact modal">&times;</button>
        </div>

        <form id="contact-form" class="modal-body">
            <div class="form-group">
                <label for="contact-name">Name</label>
                <input type="text" id="contact-name" name="name" required placeholder="Your name">
            </div>

            <div class="form-group">
                <label for="contact-email">Email</label>
                <input type="email" id="contact-email" name="email" required placeholder="your.email@example.com">
            </div>

            <div class="form-group">
                <label for="contact-reason">Reason</label>
                <select id="contact-reason" name="reason" required>
                    <option value="">Select a reason</option>
                    <option value="general">General Inquiry</option>
                    <option value="membership">Club Membership</option>
                    <option value="event">Event Information</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div class="form-group">
                <label for="contact-message">Message</label>
                <textarea id="contact-message" name="message" required placeholder="Your message here..." rows="5"></textarea>
            </div>

            <button type="submit" class="btn-primary w-full px-6 py-3 rounded-lg">
                Send Message
            </button>
        </form>

        <div id="contact-success" class="modal-body hidden">
            <div class="text-center">
                <div class="text-6xl mb-4">&#10003;</div>
                <h3 class="text-xl font-bold mb-2 text-ghgreen">Message Sent!</h3>
                <p class="text-ghmuted">We'll get back to you soon.</p>
            </div>
        </div>
    </div>`;

        document.body.appendChild(modal);
    }

    function collectFormData(form) {
        const name = form.querySelector('[name="name"]')?.value?.trim() || "";
        const email = form.querySelector('[name="email"]')?.value?.trim() || "";
        const reason = form.querySelector('[name="reason"]')?.value || "general";
        const message = form.querySelector('[name="message"]')?.value?.trim() || "";

        return {
            name: name,
            from_name: name,
            email: email,
            from_email: email,
            reply_to: email,
            reason: reason,
            message: message,
            subject: `Contact Form: ${reason}`,
            page_url: window.location.href,
            to_email: "githubclub.sithyd@gmail.com",
            to_name: "GitHub Club - SIT Hyderabad"
        };
    }

    function sendViaEmailJs(form) {
        const templateParams = collectFormData(form);

        return ensureEmailJsLoaded().then(function (emailjs) {
            if (!EMAILJS_CONFIG.templateId.startsWith("template_") || EMAILJS_CONFIG.publicKey.indexOf("REPLACE_WITH_") === 0) {
                throw new Error("EmailJS config incomplete: set templateId and publicKey.");
            }

            emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
            return emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
        });
    }

    function bindForm(form, successDiv, options) {
        if (!form || form.dataset.contactHandlerBound === "1") {
            return;
        }

        form.dataset.contactHandlerBound = "1";
        const isModal = options && options.mode === "modal";
        const onReset = options && typeof options.onReset === "function" ? options.onReset : function () {};

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Sending...";
            }

            sendViaEmailJs(form)
                .then(function () {
                    form.classList.add("hidden");
                    successDiv.classList.remove("hidden");

                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = "Send Message";
                    }
                })
                .catch(function (error) {
                    console.error("Contact form send error:", error);
                    alert("Message failed to send. Check EmailJS template/public key setup.");
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = "Send Message";
                    }
                });
        });
    }

    function initContactModal() {
        ensureModal();
        document.body.dataset.sharedContactModal = "1";

        const modal = document.getElementById("contact-modal");
        const closeBtn = document.getElementById("close-contact-modal");
        const form = document.getElementById("contact-form");
        const successDiv = document.getElementById("contact-success");
        const triggerSelector = 'a[href="index.html#contact"], #contact-link, [data-contact-trigger]';
        const contactLinks = document.querySelectorAll(triggerSelector);

        const resetModal = function () {
            if (!modal || !form || !successDiv) {
                return;
            }
            modal.classList.remove("active");
            form.classList.remove("hidden");
            successDiv.classList.add("hidden");
            form.reset();
        };

        if (modal && form && successDiv) {
            bindForm(form, successDiv, { mode: "modal", onReset: resetModal });
        }

        if (modal && closeBtn) {
            closeBtn.addEventListener("click", resetModal);
        }

        if (modal) {
            modal.addEventListener("click", function (event) {
                if (event.target === modal) {
                    resetModal();
                }
            });
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && modal && modal.classList.contains("active")) {
                resetModal();
            }
        });

        if (contactLinks.length > 0 && modal) {
            contactLinks.forEach(function (link) {
                link.addEventListener("click", function (event) {
                    event.preventDefault();
                    modal.classList.add("active");
                });
            });
        }

        const pageForm = document.getElementById("contact-page-form");
        const pageSuccess = document.getElementById("contact-page-success");
        if (pageForm && pageSuccess) {
            bindForm(pageForm, pageSuccess, { mode: "page" });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initContactModal);
    } else {
        initContactModal();
    }
})();

