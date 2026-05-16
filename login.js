/* login.js — handles sign-in and registration on login.html */
(function () {
    'use strict';

    var client = window.SKG_SUPABASE;

    document.addEventListener('DOMContentLoaded', function () {

        /* Redirect already-logged-in users */
        client.auth.getSession().then(function (result) {
            if (result.data.session) window.location.href = 'join.html';
        });

        var signInPanel   = document.getElementById('signin-panel');
        var registerPanel = document.getElementById('register-panel');
        var showRegister  = document.getElementById('show-register');
        var showSignIn    = document.getElementById('show-signin');

        var googleBtn = document.getElementById('google-signin-btn');
        googleBtn.addEventListener('click', function () {
            googleBtn.disabled    = true;
            googleBtn.textContent = 'Redirecting…';
            client.auth.signInWithOAuth({ provider: 'google' });
        });

        var loginForm     = document.getElementById('login-form');
        var registerForm  = document.getElementById('register-form');
        var loginError    = document.getElementById('login-error');
        var registerError = document.getElementById('register-error');
        var registerSuccess = document.getElementById('register-success');

        showRegister.addEventListener('click', function (e) {
            e.preventDefault();
            signInPanel.hidden   = true;
            registerPanel.hidden = false;
        });

        showSignIn.addEventListener('click', function (e) {
            e.preventDefault();
            registerPanel.hidden = true;
            signInPanel.hidden   = false;
        });

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            loginError.textContent = '';

            var email    = document.getElementById('login-email').value.trim();
            var password = document.getElementById('login-password').value;
            var btn      = loginForm.querySelector('[type="submit"]');

            btn.disabled    = true;
            btn.textContent = 'Signing in…';

            client.auth.signInWithPassword({ email: email, password: password })
                .then(function (result) {
                    if (result.error) {
                        loginError.textContent = result.error.message;
                        btn.disabled    = false;
                        btn.textContent = 'Sign In';
                    } else {
                        window.location.href = 'join.html';
                    }
                });
        });

        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            registerError.textContent   = '';
            registerSuccess.textContent = '';

            var email    = document.getElementById('reg-email').value.trim();
            var password = document.getElementById('reg-password').value;
            var btn      = registerForm.querySelector('[type="submit"]');

            btn.disabled    = true;
            btn.textContent = 'Creating account…';

            client.auth.signUp({ email: email, password: password })
                .then(function (result) {
                    btn.disabled    = false;
                    btn.textContent = 'Create Account';

                    if (result.error) {
                        registerError.textContent = result.error.message;
                    } else {
                        registerSuccess.textContent =
                            'Account created! Check your email to confirm, then sign in.';
                        registerForm.reset();
                    }
                });
        });

    });
})();
