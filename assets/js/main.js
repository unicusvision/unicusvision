// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll Animations
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(el => observer.observe(el));

    // Simple Form Validation (for contact page)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (name === '' || email === '') {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            alert('Thank you! Your request has been submitted successfully.\n\nWe will contact you within 24 hours.');
            contactForm.reset();
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 31, 61, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 31, 61, 0.95)';
        }
    });
});