/* Stop Killing Games — main.js */
(function () {
    'use strict';

    var THEME_KEY = 'skg-theme';
    var html = document.documentElement;

    /* Apply stored theme immediately (prevents flash) */
    html.setAttribute('data-theme', localStorage.getItem(THEME_KEY) || 'light');

    document.addEventListener('DOMContentLoaded', function () {

        /* --- Theme toggle --- */
        var toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', next);
                localStorage.setItem(THEME_KEY, next);
            });
        }

        /* --- Active nav link --- */
        var page = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(function (a) {
            if (a.getAttribute('href') === page) a.classList.add('active');
        });

        /* --- Mobile nav --- */
        var mobileBtn = document.querySelector('.nav-mobile-btn');
        var navLinks  = document.querySelector('.nav-links');
        if (mobileBtn && navLinks) {
            mobileBtn.addEventListener('click', function () {
                var open = navLinks.classList.toggle('is-open');
                mobileBtn.setAttribute('aria-expanded', open);
            });
            /* Close on link click */
            navLinks.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', function () {
                    navLinks.classList.remove('is-open');
                    mobileBtn.setAttribute('aria-expanded', 'false');
                });
            });
        }

    });
})();
