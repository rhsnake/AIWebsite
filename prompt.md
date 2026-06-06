# Context
I want to create a blog feature with a public-facing blog page and a
protected admin console. Blog articles should be stored in a Supabase
table (e.g. `blog_posts`). Authentication is via Google SSO (already configured).

# Objective
Create a new `/blog` page where all users can browse and read articles.
Create a `/admin` console (protected route) where the admin user can
view, create, edit, and delete blog articles.
After login, if the user is an admin, redirect them to `/admin`.
Otherwise redirect to `/blog`.

# Admin Access
Grant admin access by checking the user's email against the
`ADMIN_EMAIL` environment variable, or via a `role` column in the
Supabase `profiles` table.

# Restrictions
- Do not modify anything in the `V1/` folder.
- Do not change any existing pages.