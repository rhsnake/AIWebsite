/* blog.js — public blog listing and reading view */
(function () {
    'use strict';

    var client = window.SKG_SUPABASE;

    var postsLoading = document.getElementById('posts-loading');
    var postsEmpty   = document.getElementById('posts-empty');
    var postsGrid    = document.getElementById('posts-grid');
    var readingView  = document.getElementById('reading-view');
    var readingTitle = document.getElementById('reading-title');
    var readingDate  = document.getElementById('reading-date');
    var readingContent = document.getElementById('reading-content');
    var backBtn      = document.getElementById('back-btn');

    function escapeHtml(str) {
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(str || ''));
        return d.innerHTML;
    }

    function formatDate(iso) {
        return new Date(iso).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    function renderContent(text) {
        return (text || '').split(/\n\n+/).map(function (para) {
            return '<p>' + escapeHtml(para).replace(/\n/g, '<br>') + '</p>';
        }).join('');
    }

    function showPost(post) {
        readingTitle.textContent   = post.title;
        readingDate.textContent    = formatDate(post.created_at);
        readingContent.innerHTML   = renderContent(post.content);
        postsGrid.hidden           = true;
        readingView.hidden         = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showGrid() {
        readingView.hidden = true;
        postsGrid.hidden   = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function buildCard(post) {
        var card = document.createElement('article');
        card.className = 'blog-card';

        var dateEl = document.createElement('time');
        dateEl.className   = 'blog-card__date';
        dateEl.textContent = formatDate(post.created_at);

        var titleEl = document.createElement('h2');
        titleEl.className   = 'blog-card__title';
        titleEl.textContent = post.title;

        var readBtn = document.createElement('button');
        readBtn.className = 'btn btn-secondary blog-card__read-btn';
        readBtn.type      = 'button';
        readBtn.textContent = 'Read →';
        readBtn.addEventListener('click', function () { showPost(post); });

        card.appendChild(dateEl);
        card.appendChild(titleEl);

        if (post.excerpt) {
            var excerptEl = document.createElement('p');
            excerptEl.className   = 'blog-card__excerpt';
            excerptEl.textContent = post.excerpt;
            card.appendChild(excerptEl);
        }

        card.appendChild(readBtn);
        return card;
    }

    document.addEventListener('DOMContentLoaded', function () {
        backBtn.addEventListener('click', showGrid);

        client.from('blog_posts')
            .select('id, title, slug, excerpt, content, created_at')
            .eq('published', true)
            .order('created_at', { ascending: false })
            .then(function (result) {
                postsLoading.hidden = true;

                if (result.error) {
                    postsEmpty.textContent = 'Failed to load posts.';
                    postsEmpty.hidden = false;
                    return;
                }

                var posts = result.data;
                if (!posts || posts.length === 0) {
                    postsEmpty.hidden = false;
                    return;
                }

                posts.forEach(function (post) {
                    postsGrid.appendChild(buildCard(post));
                });
                postsGrid.hidden = false;
            });
    });
})();
