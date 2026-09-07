# Wax On Wheels

Static marketing site for **Wax On Wheels**, a mobile auto detailing company serving
Palm Beach County, Florida since 2004.

Live site: <https://peecho07.github.io/WaxonWheels/>

## Layout

```
.
├── index.html                 Home
├── our-company.html           About the company
├── detailing-services.html    Full service list and pricing (anchored sections)
├── gallery.html               Photo gallery with lightbox
├── gift-certificates.html     Gift certificates
├── contact.html               Contact and quote request
├── 404.html                   Not-found page (served by GitHub Pages)
├── assets/
│   ├── styles.css             All styling
│   └── site.js                All behaviour, no dependencies
├── robots.txt
├── sitemap.xml
├── .nojekyll                  Serve files as-is, skip Jekyll processing
└── .github/workflows/pages.yml
```

There is no build step. The pages are plain HTML and link to `assets/styles.css`
and `assets/site.js` with relative paths, so the site works from any subdirectory
and from a custom domain without changes.

## Running it locally

Any static file server will do. From the repository root:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening the `.html` files directly with
`file://` also works, though the relative asset paths are the only thing that
needs a server-like path resolution.

## Deployment

`.github/workflows/pages.yml` uploads the repository root as a Pages artifact and
deploys it on every push. For it to run, **Settings → Pages → Build and
deployment → Source** must be set to **GitHub Actions** (not "Deploy from a
branch").

## What `site.js` does

Everything is progressive — the pages are readable with JavaScript switched off.

- Mobile navigation drawer, with collapsible submenus, outside-click and `Escape` to close
- FAQ accordions
- A sticky call bar that appears on phones once the hero has scrolled past
- Gallery lightbox, dismissed by click, `Escape`, or a downward swipe
- Contact and quote forms hand off to the visitor's mail client via `mailto:`

## Known follow-ups

- **Images are hotlinked** from `https://waxonwheels.com/wp-content/uploads/...`
  rather than committed to this repository. If that domain goes away or blocks
  hotlinking, every photo on the site breaks. Downloading them into
  `assets/img/` and rewriting the `src` attributes would make the site
  self-contained.
- **Forms have no backend.** They open the visitor's email client, which means
  an enquiry is lost if the visitor has no mail client configured. A form
  service (Formspree, Netlify Forms, a small serverless function) would capture
  these reliably.
- **Terms of Use and Privacy Policy** in the footer link to `#` and need real pages.
