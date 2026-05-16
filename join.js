/* join.js — manages join page state based on auth + DB row */
(function () {
    'use strict';

    var client = window.SKG_SUPABASE;

    document.addEventListener('DOMContentLoaded', function () {

        var alreadyJoined  = document.getElementById('already-joined');
        var joinFormWrapper = document.getElementById('join-form-wrapper');
        var submitBtn      = document.querySelector('#join-form-wrapper [type="submit"]');
        var loginHint      = document.getElementById('join-login-hint');
        var statusMsg      = document.getElementById('join-status-msg');

        client.auth.getSession().then(function (result) {
            var session = result.data.session;

            if (!session) {
                /* Not logged in — form stays visible but submit is disabled */
                if (submitBtn) {
                    submitBtn.disabled    = true;
                    submitBtn.textContent = 'Log in to submit';
                }
                if (loginHint) loginHint.hidden = false;
                return;
            }

            /* Logged in — check for existing join record */
            client.from('initiative_joins')
                .select('id')
                .eq('user_id', session.user.id)
                .maybeSingle()
                .then(function (result) {
                    if (result.data) {
                        /* Already joined */
                        joinFormWrapper.hidden = true;
                        alreadyJoined.hidden   = false;
                    } else {
                        /* Not yet joined — enable form */
                        if (submitBtn) {
                            submitBtn.disabled    = false;
                            submitBtn.textContent = 'Submit Support';
                        }
                    }
                });
        });

        /* Form submission */
        var formEl = document.querySelector('#join-form-wrapper form');
        if (formEl) {
            formEl.addEventListener('submit', function (e) {
                e.preventDefault();

                client.auth.getSession().then(function (result) {
                    var session = result.data.session;
                    if (!session) return;

                    submitBtn.disabled    = true;
                    submitBtn.textContent = 'Submitting…';

                    client.from('initiative_joins')
                        .insert({ user_id: session.user.id })
                        .then(function (result) {
                            if (result.error) {
                                if (statusMsg) statusMsg.textContent = 'Something went wrong. Please try again.';
                                submitBtn.disabled    = false;
                                submitBtn.textContent = 'Submit Support';
                            } else {
                                joinFormWrapper.hidden = true;
                                alreadyJoined.hidden   = false;
                            }
                        });
                });
            });
        }

    });
})();
