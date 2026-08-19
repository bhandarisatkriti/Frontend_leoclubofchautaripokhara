# Leo Club of Chautari Pokhara — Website

Next.js 16 (App Router) + TypeScript + Tailwind CSS frontend for the Leo Club of
Chautari Pokhara, backed by the Django REST API in
[`../backend_leoclubofchautaripokhara`](../backend_leoclubofchautaripokhara).

---

## Running it

The site reads all of its content from the API, so start the backend first.

```bash
# terminal 1 — backend (http://127.0.0.1:8000)
cd ../backend_leoclubofchautaripokhara
uv run python manage.py runserver

# terminal 2 — frontend (http://localhost:3000)
npm run dev
```

Content is entered through the Django admin at <http://127.0.0.1:8000/admin/>.
Pages render with empty states until it exists, so nothing breaks on a fresh
database.

### On your local network

To open the site on a phone or another laptop on the same Wi-Fi, bind the
backend to every interface — the frontend already does:

```bash
# terminal 1 — backend, reachable from other devices
uv run python manage.py runserver 0.0.0.0:8000

# terminal 2 — frontend
npm run dev
```

Then browse to `http://<this-machine's-LAN-IP>:3000` (`ipconfig` on Windows,
`ip addr` elsewhere). Nothing needs configuring per address: the browser
resolves the API host from the page it was served, Django adds its own
addresses to `ALLOWED_HOSTS` and accepts private-range origins while `DEBUG`
is on, and the membership QR encodes whichever host the visitor used. All of
that is development-only — in production `NEXT_PUBLIC_API_URL`,
`NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` are the single source of truth.

Windows Firewall prompts the first time something connects from outside; the
ports have to be allowed on a **private** network for it to work.

## Environment

Copy `.env.example` to `.env.local` (gitignored):

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api   # no trailing slash
NEXT_PUBLIC_SITE_URL=http://localhost:3000      # used for Open Graph URLs
```

`NEXT_PUBLIC_API_URL` also drives the `next/image` allow-list in
`next.config.ts`, so pointing at a different backend needs no code change.

## How the frontend talks to the API

| File | Role |
| --- | --- |
| `app/lib/api.ts` | fetch helpers, endpoint paths, form submission |
| `app/lib/types.ts` | TypeScript mirror of the DRF serializers |
| `app/lib/site.ts` | static fallbacks + `clubProfile()` merge helper |

- **`endpoints`** holds every backend path. Nothing else hardcodes a URL.
- **`fetchList<T>()`** unwraps DRF's `{count, next, previous, results}` envelope
  (and accepts the bare arrays that the taxonomy endpoints return). It yields
  `[]` if the backend is unreachable, so a page still renders.
- **`getClubInformation()`** returns `null` when the club profile has not been
  created yet — the API answers `404` until then, which is expected, not an
  error.
- **`submitForm()`** posts the public forms and splits DRF's field-keyed `400`
  responses into per-field messages, with dedicated handling for `429`
  (throttled) and network failures.

Data flows in as Server Components; only the form (`app/components/api-form.tsx`)
is a client component.

### Where each page gets its data

| Page | Endpoint |
| --- | --- |
| `/` | `/club/`, `/events/?upcoming=true`, `/articles/` |
| `/team` | `/team/` |
| `/events` | `/events/?upcoming=true` and `/events/?past=true` |
| `/gallery` | `/gallery/`, `/gallery/categories/` (`?category=` filter) |
| `/news` | `/articles/`, `/article-categories/` (`?category=` filter) |
| `/contact` | `/club/` for contact details · posts to `/contact/` |
| `/membership` | posts to `/memberships/` |
| header/footer | `/club/` |

Contact details, social links and the club name come from `/api/club/`, so
administrators can change them from the Django admin without a redeploy.
`app/lib/site.ts` supplies per-field fallbacks until that record exists.

### Forms

Field names in `app/contact/page.tsx` and `app/membership/page.tsx` match the
DRF serializers exactly — renaming one without changing the backend will produce
a `400`. Both forms include the hidden `website` honeypot the backend expects;
leave it empty.

## Caching

`cacheComponents` is not enabled, so the standard `fetch` caching model applies.
Lists revalidate every 5 minutes and the club profile every hour
(`apiFetch(path, { revalidate })`). Pass `revalidate: false` for a live read.

## Notes

- **`public/logo.png` is missing.** `app/components/logo.tsx` and the metadata
  in `app/layout.tsx` both reference it, so the emblem and favicon currently
  404. Drop the club emblem in at `public/logo.png`.
- `next/image` needs the backend host allow-listed. `next.config.ts` derives it
  from `NEXT_PUBLIC_API_URL` and additionally sets `dangerouslyAllowLocalIP`
  **in development only** — Next.js 16 refuses to optimize images from local IP
  addresses as an SSRF guard, which would otherwise block the Django dev server
  on `127.0.0.1`.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint
npx tsc --noEmit # typecheck
```
