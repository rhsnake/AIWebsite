/* admin.js — protected blog management console */
(function () {
    'use strict';

    var client = window.SKG_SUPABASE;

    /* ── State ── */
    var editingId = null;
    var postsCache = {};

    /* ── DOM refs ── */
    var adminGate    = document.getElementById('admin-gate');
    var adminContent = document.getElementById('admin-content');
    var postsCount   = document.getElementById('posts-count');
    var postsList    = document.getElementById('posts-list');
    var postsLoading = document.getElementById('posts-loading');
    var postsEmpty   = document.getElementById('posts-empty');

    var newPostBtn   = document.getElementById('new-post-btn');
    var formSection  = document.getElementById('form-section');
    var formHeading  = document.getElementById('form-heading');
    var postForm     = document.getElementById('post-form');
    var fieldTitle   = document.getElementById('field-title');
    var fieldSlug    = document.getElementById('field-slug');
    var fieldExcerpt = document.getElementById('field-excerpt');
    var fieldContent = document.getElementById('field-content');
    var fieldPublished = document.getElementById('field-published');
    var formError    = document.getElementById('form-error');
    var submitBtn    = document.getElementById('submit-btn');
    var cancelBtn    = document.getElementById('cancel-btn');
    var slugRegen    = document.getElementById('slug-regen');

    /* ── Helpers ── */
    function escapeHtml(str) {
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(str || ''));
        return d.innerHTML;
    }

    function formatDate(iso) {
        return new Date(iso).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }

    function generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /* ── Form ── */
    function showForm(post) {
        editingId = post ? post.id : null;
        formHeading.textContent  = post ? 'Edit Post' : 'New Post';
        submitBtn.textContent    = post ? 'Save Changes' : 'Create Post';
        fieldTitle.value         = post ? post.title : '';
        fieldSlug.value          = post ? post.slug : '';
        fieldExcerpt.value       = post ? (post.excerpt || '') : '';
        fieldContent.value       = post ? post.content : '';
        fieldPublished.checked   = post ? post.published : false;
        formError.textContent    = '';

        if (post) {
            fieldSlug.dataset.locked = '1';
        } else {
            delete fieldSlug.dataset.locked;
        }

        formSection.hidden = false;
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        fieldTitle.focus();
    }

    function hideForm() {
        editingId = null;
        delete fieldSlug.dataset.locked;
        postForm.reset();
        formError.textContent = '';
        formSection.hidden = true;
    }

    /* ── Post rows ── */
    function buildRow(post) {
        var row = document.createElement('div');
        row.className  = 'post-row';
        row.dataset.id = post.id;

        var info = document.createElement('div');
        info.className = 'post-row__info';

        var titleSpan = document.createElement('span');
        titleSpan.className   = 'post-row__title';
        titleSpan.textContent = post.title;

        var meta = document.createElement('span');
        meta.className = 'post-row__meta';

        var badge = document.createElement('span');
        badge.className   = 'post-status post-status--' + (post.published ? 'published' : 'draft');
        badge.textContent = post.published ? 'Published' : 'Draft';

        var dateText = document.createTextNode(' · ' + formatDate(post.created_at));

        meta.appendChild(badge);
        meta.appendChild(dateText);
        info.appendChild(titleSpan);
        info.appendChild(meta);

        var actions = document.createElement('div');
        actions.className = 'post-row__actions';

        var editBtn = document.createElement('button');
        editBtn.className        = 'btn btn-secondary post-edit-btn';
        editBtn.type             = 'button';
        editBtn.textContent      = 'Edit';
        editBtn.dataset.id       = post.id;

        var deleteBtn = document.createElement('button');
        deleteBtn.className      = 'btn btn-danger post-delete-btn';
        deleteBtn.type           = 'button';
        deleteBtn.textContent    = 'Delete';
        deleteBtn.dataset.id     = post.id;

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        row.appendChild(info);
        row.appendChild(actions);
        return row;
    }

    /* ── Load posts ── */
    function loadPosts() {
        postsLoading.hidden = false;
        postsEmpty.hidden   = true;
        Array.from(postsList.querySelectorAll('.post-row')).forEach(function (el) { el.remove(); });

        client.from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .then(function (result) {
                postsLoading.hidden = true;

                if (result.error) {
                    postsEmpty.textContent = 'Error loading posts: ' + result.error.message;
                    postsEmpty.hidden = false;
                    return;
                }

                var posts = result.data || [];
                postsCount.textContent = posts.length + ' Post' + (posts.length === 1 ? '' : 's');

                if (posts.length === 0) {
                    postsEmpty.hidden = false;
                    return;
                }

                postsCache = {};
                posts.forEach(function (post) {
                    postsCache[post.id] = post;
                    postsList.appendChild(buildRow(post));
                });
            });
    }

    /* ── Save (create or update) ── */
    function savePost() {
        var title     = fieldTitle.value.trim();
        var slug      = fieldSlug.value.trim() || generateSlug(title);
        var excerpt   = fieldExcerpt.value.trim() || null;
        var content   = fieldContent.value.trim();
        var published = fieldPublished.checked;

        if (!title) { formError.textContent = 'Title is required.'; return; }
        if (!content) { formError.textContent = 'Content is required.'; return; }
        if (!slug) { formError.textContent = 'Could not generate a slug from the title.'; return; }

        submitBtn.disabled    = true;
        submitBtn.textContent = 'Saving…';
        formError.textContent = '';

        var payload = { title: title, slug: slug, excerpt: excerpt, content: content, published: published };

        var query = editingId
            ? client.from('blog_posts').update(payload).eq('id', editingId).select().single()
            : client.from('blog_posts').insert(payload).select().single();

        query.then(function (result) {
            submitBtn.disabled    = false;
            submitBtn.textContent = editingId ? 'Save Changes' : 'Create Post';

            if (result.error) {
                formError.textContent = result.error.message;
                return;
            }

            hideForm();
            loadPosts();
        });
    }

    /* ── Delete ── */
    function deletePost(id) {
        var post = postsCache[id];
        var title = post ? post.title : 'this post';
        if (!confirm('Delete "' + title + '"? This cannot be undone.')) return;

        client.from('blog_posts').delete().eq('id', id).then(function (result) {
            if (result.error) {
                alert('Delete failed: ' + result.error.message);
                return;
            }
            loadPosts();
        });
    }

    /* ── Init (auth guard) ── */
    async function init() {
        var sessionResult = await client.auth.getSession();
        var session = sessionResult.data.session;

        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        var profileResult = await client
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (profileResult.error || !profileResult.data || profileResult.data.role !== 'admin') {
            window.location.href = 'blog.html';
            return;
        }

        /* Admin confirmed */
        adminGate.hidden    = true;
        adminContent.hidden = false;

        loadPosts();

        /* Toolbar */
        newPostBtn.addEventListener('click', function () { showForm(null); });
        cancelBtn.addEventListener('click', hideForm);

        /* Slug auto-generation */
        fieldTitle.addEventListener('input', function () {
            if (!fieldSlug.dataset.locked) {
                fieldSlug.value = generateSlug(fieldTitle.value);
            }
        });

        slugRegen.addEventListener('click', function (e) {
            e.preventDefault();
            fieldSlug.value = generateSlug(fieldTitle.value);
            delete fieldSlug.dataset.locked;
        });

        fieldSlug.addEventListener('input', function () {
            if (fieldSlug.value) {
                fieldSlug.dataset.locked = '1';
            } else {
                delete fieldSlug.dataset.locked;
            }
        });

        /* Form submit */
        postForm.addEventListener('submit', function (e) {
            e.preventDefault();
            savePost();
        });

        /* Edit / Delete delegation */
        postsList.addEventListener('click', function (e) {
            var editBtn   = e.target.closest('.post-edit-btn');
            var deleteBtn = e.target.closest('.post-delete-btn');

            if (editBtn) {
                var post = postsCache[editBtn.dataset.id];
                if (post) showForm(post);
            }

            if (deleteBtn) {
                deletePost(deleteBtn.dataset.id);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
