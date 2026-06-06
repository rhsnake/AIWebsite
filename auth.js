/* auth.js — runs on every page, injects auth state into nav */
(function () {
    'use strict';

    var client = window.SKG_SUPABASE;

    function setAdminLink(show) {
        var existing = document.querySelector('.nav-admin-link');
        if (show && !existing) {
            var navLinks = document.getElementById('nav-links');
            if (!navLinks) return;
            var li = document.createElement('li');
            li.className = 'nav-admin-link';
            var a = document.createElement('a');
            a.href = 'admin.html';
            a.textContent = 'Admin';
            li.appendChild(a);
            navLinks.appendChild(li);
        } else if (!show && existing) {
            existing.remove();
        }
    }

    function checkAdminRole(session) {
        client.from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
            .then(function (result) {
                setAdminLink(!result.error && result.data && result.data.role === 'admin');
            })
            .catch(function () { setAdminLink(false); });
    }

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

            checkAdminRole(session);
        } else {
            var loginLink = document.createElement('a');
            loginLink.href = 'login.html';
            loginLink.className = 'btn btn-secondary nav-login-btn';
            loginLink.textContent = 'Login';
            navRight.insertBefore(loginLink, navRight.firstChild);

            setAdminLink(false);
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
