# Today's Weather

A single-page weather search: type a city, get today's conditions, and keep a
list of what you've looked up. Built for the Techfinity Hub frontend
assessment.

React 18 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · TanStack Query ·
Vitest + Testing Library + MSW

## Running it

```bash
npm install
cp .env.example .env.local     # then paste your key into it
npm run dev                    # http://localhost:5173
```

A free API key comes from [openweathermap.org/api](https://openweathermap.org/api).
New keys take a few minutes to activate; until then the service returns 401
and the app says so explicitly.

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck then production build |
| `npm run lint` | ESLint |
| `npm run test` | Tests, watching |
| `npm run test:run` | Tests, once |

## Requirements

| # | Requirement | Where |
|---|---|---|
| 1 | Display at least the mockup's information | `features/weather/components/weather-summary.tsx` |
| 2 | City + country input, weather over AJAX | `weather-search-form.tsx`, `features/weather/api/` |
| 3 | History with re-search and delete | `features/search-history/` |
| 4 | Message on invalid city or country | `features/weather/model/error-messages.ts` |
| 5 | Dark **or** light theme | both are built |
| 6 | *Optional:* both themes with a switcher | `components/theme/` |

UI-behaviour decisions are in [ASSUMPTIONS.md](./ASSUMPTIONS.md).

## How it's put together

```
src/
  app/            providers, query client, smooth-scroll hook
  components/     ui (shadcn), theme, layouts, routes
  features/
    weather/      api · model · hooks · components
    search-history/  model · repository · hooks · components
  lib/            env, errors, formatting, utils
  pages/          today-weather, not-found
  test/           MSW server, handlers, fixtures, render helper
```

Two ideas do most of the structural work.

### The provider stops at the API layer

`api/dto.ts` holds OpenWeather's response shapes and nothing else. `mappers.ts`
converts them into the `WeatherSnapshot` the UI renders. No component knows
that `main.temp_max` exists, so a field rename on the provider's side changes
exactly one file.

`weather-service.ts` is the feature's only public entry point. It currently
geocodes the place, then fetches conditions for the resulting coordinates —
the Geocoding API gives an unambiguous "this place does not exist" (an empty
array) that a transport failure cannot be confused with, which is what
requirement 4 needs. That it takes two requests is an implementation detail;
collapsing it back to a single `?q=` call would not change a line outside that
file.

HTTP concerns stop at `openweather-client.ts`, which maps status codes onto a
small error taxonomy in `lib/errors.ts`. Everything upstream — the retry
policy, the UI — branches on error *type*, never on a status code:

```ts
retry: (failureCount, error) => isRetryable(error) && failureCount < 2
```

A mistyped city or a bad key surfaces immediately; a dropped connection or a
5xx is retried twice. Retrying a 404 would only delay the message the user
needs.

### Storage sits behind a port

`SearchHistoryRepository` is a four-method interface. The UI depends on it;
`localStorage` is one implementation of it. Moving history to a signed-in
account means writing one more adapter — no component changes. Every read from
storage is defensive, because it is shared with the user, other tabs, and
earlier versions of this app.

### Design tokens

Colour lives in `src/index.css` in three tiers: primitives (raw channels and a
two-step alpha scale), semantic roles composed from them, and a Tailwind
mapping. No component contains a colour, and no component carries a `dark:`
variant — they name roles, and the theme decides the values.

Glassmorphism is treated as three independent axes rather than one bundled
class, so any one can change without disturbing the others:

```html
<li class="glass bg-surface-row border border-glass-border rounded-row">
<!--       material    fill            edge -->
```

Every alpha in the design is four lines of CSS. One caveat is worth knowing:
`backdrop-filter` compounds when nested, so only the outermost card and the
standalone search bar carry `glass`; the panel and rows inside take fill and
border only.

## Accessibility and standards

A real `<form role="search">` with a bound `<label>`, so Enter submits and the
control is announced correctly. History is a `<ul>`/`<li>` inside a labelled
`<section>`; icon-only buttons carry specific labels ("Search weather for
Johor, MY again"). Results sit in an `aria-live="polite"` region with
`aria-busy` during fetches. Each fact renders in the DOM exactly once and is
positioned per breakpoint with grid coordinates — duplicating markup for
mobile and desktop would make a screen reader announce the humidity twice.
`prefers-reduced-motion` disables both smooth scrolling and transitions.

Light-theme secondary text was darkened from the Figma's `#666666` to
`#444444` to clear WCAG AA against the photographic backdrop; the measurement
is in ASSUMPTIONS.md.

## Motion

Three icon transitions — theme toggle, search-to-spinner, and the weather
illustration — run through one `IconSwap` component rather than three bespoke
animations. Motion is loaded through `LazyMotion` with the `m` component and
the DOM-animation feature bundle, which keeps roughly 14 kB gzipped of
animation features in a separate chunk instead of the critical path; `strict`
mode throws if a component reaches for the eager `motion` export by mistake.
Under `prefers-reduced-motion` the animation wrapper is not rendered at all.

## Testing

41 tests. The emphasis is on the boundaries where this kind of app actually
breaks rather than on a coverage number:

- **`mappers.test.ts`** — provider shape to domain shape, including absent
  condition data and epoch conversion
- **`format.test.ts`** — the mockup's `01-09-2022 09:41am`, 12-hour
  boundaries, and timezone handling
- **`parse-place-query.test.ts`** — `"Johor, MY"`, bare cities, untidy
  spacing, blank input
- **`local-storage-search-history-repository.test.ts`** — dedupe, ordering,
  the cap, corrupt JSON, and storage that rejects writes
- **`today-weather.test.tsx`** — against MSW: the happy path, unknown place,
  network failure, rejected key, empty submit, recovery after failure
- **`search-history.integration.test.tsx`** — records, dedupes, re-calls the
  API from a row, deletes, and survives a remount

## Security note

`VITE_OPENWEATHER_API_KEY` is compiled into the bundle and readable by anyone
who opens devtools. That is acceptable for an assessment and is *not*
acceptable in production: the call belongs behind a small backend-for-frontend
that holds the key server-side and exposes a key-less route. `vite.config.ts`
carries a commented proxy block showing the shape. Because all HTTP lives in
`openweather-client.ts`, repointing the app at that BFF is a base-URL change.

## What I'd do next

Beyond this brief's scope, deliberately: per-service clients as the number of
backends grows, a shared design-system package if these tokens were to serve
more than one app, and Module Federation if the surfaces were owned by
separate teams. All three are worth doing when there is a second consumer —
none of them is worth doing for one page.
