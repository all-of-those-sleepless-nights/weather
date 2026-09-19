# Assumptions

The brief invites UI-behaviour assumptions to be stated separately. These are
the decisions that were not fully determined by the requirements or the
mockup, with the reasoning behind each.

## Search input

**One field accepting `City, Country`.** The mockup shows a single field
float-labelled "Country", while requirement 2 asks the user to input a city
*and* a country name. Rather than add a second field the mockup does not have,
the field takes both and splits on the comma. The visible label reads
"City, Country" so the format is discoverable without a placeholder.

**The country is optional.** `Singapore` works as well as `Singapore, SG`;
the geocoder resolves the best match. Rejecting a bare city would be a
restriction the brief does not ask for.

**Country is matched as OpenWeather accepts it** — an ISO 3166 code such as
`MY` is reliable, and full country names work where the provider recognises
them.

## Search history

**A search is recorded when it is submitted, not when it succeeds.** The
history is a record of what the user looked for; a failed lookup is exactly
the thing worth retrying from the list, so it is kept.

**Repeats update rather than duplicate.** Searching a place already in the
list moves it to the top and refreshes its timestamp, matching the mockup's
list of distinct places.

**Capped at 20 entries**, newest first. The mockup shows a scrolling list with
no stated limit; a cap keeps the stored payload small and the list usable.

**Stored in `localStorage`, unscoped to any user.** The brief does not mention
accounts, so no authentication was added. Storage sits behind the
`SearchHistoryRepository` interface, so moving history to a signed-in account
means adding one adapter and changing no component.

**Corrupt or unreadable storage degrades to an empty list** rather than
throwing on boot. Browser storage is shared with the user, other tabs and
earlier versions of the app, so it is treated as untrusted input.

## Weather data

**Metric units.** The mockup shows `26°` with no unit marker; Celsius matches
the cities shown.

**`H:` and `L:` come from `main.temp_max` and `main.temp_min`.** For a single
city the current-weather endpoint frequently reports both as equal to `temp`,
so the displayed high and low can match the current temperature. This is the
provider's behaviour on the free tier, not a display bug — the mockup itself
shows `H: 29° L: 26°` against a current `26°`. A daily forecast endpoint would
give a true range but is a paid product.

**Observation times are shown in the searched city's local time**, using the
`timezone` offset the API returns — "09:41am in Johor" should not change
depending on who is looking at it. Search-history timestamps, by contrast,
record when *this user* searched, so they are shown in the viewer's own
timezone.

**Place names come from the geocoder, not the weather response.** The weather
endpoint reports the nearest reporting station, which can carry a different
name from the place that was searched.

## Icons and imagery

**Two illustrations across nine condition groups.** The supplied kit contains
a sun-behind-cloud and a cloud. Skies with sun still showing — clear, few
cloud and scattered cloud (`01`, `02`, `03`) — use the sun-behind-cloud, which
is the pairing the mockup shows against the condition "Clouds". Broken cloud
onwards (`04` and the rain, snow, thunderstorm and fog groups) uses the cloud.
The condition text is always shown alongside, so no information depends on
the illustration.

**Backgrounds were re-encoded as JPEG** (roughly 900 KB each as supplied,
about 160 KB after). A flat colour sits behind them so layout never depends on
an image loading.

## Theme

**Both themes are built, with a switcher**, claiming requirement 6. The first
visit follows the operating system's `prefers-color-scheme`; an explicit
choice is remembered. An inline script in `index.html` applies the stored
theme before first paint so the page never flashes the wrong one.

## Deviations from the Figma

**Light-theme secondary text darkened from `#666666` to `#444444`.** Over the
20 %-white glass on the lavender photograph, `#666666` measures roughly
2.6:1–3.3:1 against the background depending on where the cloud texture
falls. WCAG AA requires 4.5:1 for normal text, and "Web Standards compliance"
is one of the stated evaluation criteria, so the value was darkened until it
passes. At this size the two greys are near-indistinguishable.

**Dark-theme secondary text left at `#FFFFFF`,** identical to primary, as
specified. Hierarchy between a place name and its timestamp comes from weight
and size instead. `--alpha-ink-muted` is in the token set as the single knob
if that should change.

**The search bar shares the glass border rather than carrying its own.** Figma
specifies a 1 px solid `#000000` rule on the light-theme input. Rendered over
the photographic backdrop it reads as a hard outline beside the white hairline
on the card, the history panel and every row — the one edge in the composition
that does not look like the same material. The likeliest explanation is layer
opacity applied above the stroke colour, which would not appear in the copied
value. It now uses `--glass-border` in both themes, which leaves the design
with a single edge token; the dark theme is unaffected, since both values were
already `#FFFFFF1A`.

## Motion

**Icon changes cross-fade rather than cut.** The theme toggle, the search
button's magnifier-to-spinner, and the weather illustration all swap through
`IconSwap` (`src/components/motion/icon-swap.tsx`), which overlaps the
outgoing and incoming icons in one grid cell while rotating or lifting them
past each other.

This is not a true morph, and the distinction is worth stating: Framer Motion
interpolates transforms and opacity, not SVG path geometry. Morphing one path
into another needs a dedicated interpolator such as flubber and only works on
single-path shapes, which these Lucide glyphs are not; the weather
illustrations are raster PNGs with no geometry to interpolate at all. An
overlapping cross-fade is what reads as a single transformation here.

**The illustration is keyed on the resolved image, not the condition code,**
so moving between two conditions that share an illustration — clear sky to few
clouds — updates the alternative text without animating an identical picture.

**Under `prefers-reduced-motion` the presence wrapper is dropped entirely**
rather than merely shortened, so exactly one icon exists in the accessibility
tree at all times.

## Scope

**No pagination.** React Query is used for caching, request de-duplication,
the retry policy and the loading/error state machine. The history list is
local and capped, so there is nothing to paginate.

**No routing beyond `/` and a 404.** The brief describes one page.
