# Schema.org Design Reference — Stop Killing Games

Structured data strategy for the static site, based on [schema.org](https://schema.org).
All markup is embedded as `<script type="application/ld+json">` in each page's `<head>`.

---

## Vocabulary overview

Schema.org defines a shared vocabulary of **Types** (classes) and **Properties** (attributes).
Every JSON-LD block must include `"@context": "https://schema.org"`. Types are given as `"@type"`.
Use `"@id": "#anchor"` to define reusable nodes that other objects can reference with `{ "@id": "#anchor" }`.

---

## Types in use

### `WebSite`
Declared once on every page as a reusable node (`"@id": "#website"`).

| Property | Value used | Why |
|---|---|---|
| `name` | `"Stop Killing Games"` | Site title |
| `url` | `"https://www.stopkillinggames.com"` | Canonical origin |
| `description` | Campaign summary | Full description on `index.html` only |
| `inLanguage` | `"en"` | Language of content |

**Potential additions:**
- `publisher` → points to `#organization`
- `potentialAction` → `SearchAction` if a search feature is added

---

### `Organization`
Declared on `index.html` and referenced in `about.html` via `mainEntity`.

| Property | Value used | Why |
|---|---|---|
| `name` | `"Stop Killing Games"` | Official campaign name |
| `url` | Campaign URL | Canonical reference |
| `description` | Mission statement | Describes purpose |
| `founder` | `Person` → Ross Scott | Attribution |

**Potential additions:**
- `foundingDate` — when the campaign formally launched
- `areaServed` — `"Global"` to reflect international scope
- `knowsAbout` — `"consumer rights"`, `"video game preservation"`
- `sameAs` — Wikipedia article, YouTube channel, social profiles
- `logo` — `ImageObject` with `url` + `width` + `height`

---

### `Person`
Used inline inside `Organization.founder` and `AboutPage.about.founder`.

| Property | Value used | Why |
|---|---|---|
| `name` | `"Ross Scott"` | Founder identity |
| `jobTitle` | `"Content Creator & Activist"` | Role description |
| `description` | Bio summary | Context for the person |

**Potential additions:**
- `url` — link to Ross Scott's personal site or YouTube channel
- `sameAs` — YouTube, Twitter/X, Wikipedia
- `image` — `ImageObject` pointing to a portrait

---

### `WebPage` / `AboutPage` / `ContactPage`
One per page. All inherit from `WebPage`.

| Page | Type | Key properties used |
|---|---|---|
| `index.html` | `WebPage` | `name`, `isPartOf`, `about`, `description` |
| `about.html` | `AboutPage` | `name`, `isPartOf`, `description`, `about` |
| `milestones.html` | `WebPage` | `name`, `isPartOf`, `description` |
| `join.html` | `ContactPage` | `name`, `isPartOf`, `description`, `potentialAction` |

**Potential additions (all pages):**
- `datePublished` / `dateModified` — ISO 8601 date strings
- `inLanguage` — `"en"` consistent with `WebSite`
- `breadcrumb` — `BreadcrumbList` for pages deeper than home

---

### `ItemList` + `Event`
Used on `milestones.html` to mark up the timeline.

**`ItemList` properties:**

| Property | Value used |
|---|---|
| `name` | `"Stop Killing Games — Major Milestones"` |
| `itemListElement` | Array of `ListItem` nodes |

**`ListItem` properties:**

| Property | Value used |
|---|---|
| `position` | Integer (1, 2, 3 …) |
| `item` | Nested `Event` |

**`Event` properties in use:**

| Property | Value used |
|---|---|
| `name` | Milestone label |
| `startDate` | Year or ISO date |
| `location` | `Place` → `name` |
| `description` | Summary of the milestone |

**Potential additions per Event:**
- `endDate` — for events spanning a date range
- `eventStatus` — `EventScheduled`, `EventCancelled`, etc.
- `organizer` → `{ "@id": "#organization" }`
- `url` — link to a press release or external source
- `image` — `ImageObject` for milestone illustrations

---

### `JoinAction` (via `potentialAction`)
Used on `join.html` inside `ContactPage`.

| Property | Value used |
|---|---|
| `@type` | `JoinAction` |
| `name` | `"Join Stop Killing Games"` |
| `target` | URL of the join page |

---

## Graph structure

Each page uses `@graph` to bundle multiple type declarations into one block.
Shared nodes (`#website`, `#organization`) are defined once and referenced elsewhere.

```
index.html
  └── @graph
        ├── WebSite        (@id: #website)
        ├── Organization   (@id: #organization)
        └── WebPage        (isPartOf: #website, about: #organization)

about.html
  └── @graph
        ├── WebSite        (@id: #website)
        └── AboutPage      (isPartOf: #website, about: Organization → Person)

milestones.html
  └── @graph
        ├── WebSite        (@id: #website)
        ├── WebPage        (isPartOf: #website)
        └── ItemList       (itemListElement: [ListItem → Event, …])

join.html
  └── @graph
        ├── WebSite        (@id: #website)
        └── ContactPage    (isPartOf: #website, potentialAction: JoinAction)
```

---

## Adding a new page

1. Include `WebSite` with `@id: "#website"` (copy from any existing page).
2. Add a page-specific `WebPage` subtype (`AboutPage`, `ContactPage`, `CollectionPage`, etc.) with `isPartOf: { "@id": "#website" }`.
3. Update `"@type": "WebPage"` to the most specific applicable subtype from schema.org.
4. Set `name`, `description`, and optionally `datePublished`.
5. Add the `<a>` to the nav in **all four** existing pages.

---

## Validation

Test any page with the [Schema.org validator](https://validator.schema.org) or
Google's [Rich Results Test](https://search.google.com/test/rich-results).
Both accept a URL or raw JSON-LD paste.
