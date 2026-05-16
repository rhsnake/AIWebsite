/* auth.js — runs on every page, injects auth state into nav */
(function () {
    'use strict';

    var client = window.SKG_SUPABASE;

    function updateNav(session) {
        var navRight = document.querySelector('.nav-right');
        if (!navRight) return;

        var existing = navRight.querySelector('.nav-auth, .nav-login-btn');
        if (existing) existing.remove();

        if (session) {
            var authEl = document.createElement('div');
            authEl.className = 'nav-auth';

            var emailSpan = document.createElement('span');
            emailSpan.className = 'nav-user-email';
            emailSpan.textContent = session.user.email;

            var logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-secondary nav-logout-btn';
            logoutBtn.textContent = 'Log out';
            logoutBtn.addEventListener('click', function () {
                client.auth.signOut().then(function () {
                    window.location.href = 'index.html';
                });
            });

            authEl.appendChild(emailSpan);
            authEl.appendChild(logoutBtn);
            navRight.insertBefore(authEl, navRight.firstChild);
        } else {
            var loginLink = document.createElement('a');
            loginLink.href = 'login.html';
            loginLink.className = 'btn btn-secondary nav-login-btn';
            loginLink.textContent = 'Login';
            navRight.insertBefore(loginLink, navRight.firstChild);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        client.auth.getSession().then(function (result) {
            updateNav(result.data.session);
        });

        client.auth.onAuthStateChange(function (_event, session) {
            updateNav(session);
        });
    });
})();
