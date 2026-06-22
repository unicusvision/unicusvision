(function () {
    window.onRecaptchaLoad = function onRecaptchaLoad() {
        const config = window.CONTACT_FORM_CONFIG;
        if (!config?.recaptchaSiteKey || config.recaptchaSiteKey.includes('YOUR_')) {
            return;
        }
        document.querySelectorAll('.recaptcha-container').forEach(function (el) {
            if (el.dataset.rendered) return;
            grecaptcha.render(el, { sitekey: config.recaptchaSiteKey });
            el.dataset.rendered = 'true';
        });
    };

    function getConfig() {
        const config = window.CONTACT_FORM_CONFIG;
        if (!config?.endpoint || !config?.recaptchaSiteKey || !config?.formSecret) {
            throw new Error('Contact form is not configured. Copy assets/js/form-config.example.js to form-config.js.');
        }
        if (config.recaptchaSiteKey.includes('YOUR_') || config.formSecret.includes('YOUR_')) {
            throw new Error('Update assets/js/form-config.js with your reCAPTCHA site key and form secret.');
        }
        return config;
    }

    function showCaptchaError(form, message) {
        const errorEl = form.querySelector('.captcha-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.hidden = false;
        } else {
            alert(message);
        }
    }

    function clearCaptchaError(form) {
        const errorEl = form.querySelector('.captcha-error');
        if (errorEl) {
            errorEl.hidden = true;
        }
    }

    window.handleFormSubmit = async function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        clearCaptchaError(form);

        const honeypot = form.querySelector('[name="_website"]');
        if (honeypot?.value) {
            return;
        }

        if (typeof grecaptcha === 'undefined') {
            showCaptchaError(form, 'Security check failed to load. Please refresh the page.');
            return;
        }

        const recaptchaToken = grecaptcha.getResponse();
        if (!recaptchaToken) {
            showCaptchaError(form, 'Please complete the CAPTCHA verification.');
            return;
        }

        let config;
        try {
            config = getConfig();
        } catch (err) {
            console.error(err);
            alert('The contact form is not configured yet. Please email sales@unicusvision.com directly.');
            return;
        }

        const data = Object.fromEntries(new FormData(form));
        delete data._website;

        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
            const response = await fetch(config.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    ...data,
                    recaptchaToken,
                    formSecret: config.formSecret
                }),
                redirect: 'follow'
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Server rejected the submission.');
            }

            alert('Thank you! Your message has been received. A Unicus Vision specialist will contact you within 1 business day.');
            form.reset();
            grecaptcha.reset();
        } catch (err) {
            console.error('Form submission failed:', err);
            alert('Submission failed: ' + err.message + '\n\nPlease email sales@unicusvision.com directly.');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    };
})();
