# Assumptions

The brief invites UI-behaviour assumptions to be stated separately. These are
the decisions that were not fully determined by the requirements or the
mockup, with the reasoning behind each.

## Search input

**Two fields inside one pill, with the comma printed between them.** The
mockup shows a single field float-labelled "Country", while requirement 2 asks
the user to input a city *and* a country name. Both are captured without
adding a second visible control: the pill holds a city box and a two-character
country box with a static `,` between them, so the separator is furniture
rather than something to remember to type. The silhouette still matches the
mockup and `Singapore, SG` reads as one phrase.

The city box uses `field-sizing: content` so it grows with what is typed and
the comma stays against the name. Where that property is unsupported the
`size` attribute holds a sensible width and the layout still reads correctly.

The two boxes share one visible group label, and each carries its own
screen-reader label ("City", "Country code") so neither is announced as
unlabelled.

**The country is optional.** `Singapore` works as well as `Singapore, SG`;
the geocoder resolves the best match. Rejecting a bare city would be a
restriction the brief does not ask for.

**The country must be an ISO 3166-1 alpha-2 code** when given — `MY`, not
`Malaysia` — which is what the OpenWeather geocoder matches on. The field is
capped at two characters and upper-cased on submit.

**Zod is imported as `zod/mini`.** Same validators, composed with `z.pipe`
instead of method chaining, and tree-shakeable. Measured on this bundle the
full package costs 24.2 kB gzipped against 5.5 kB for mini — a 13 % swing on
a 145 kB bundle for validating two text fields, which is not a good trade on
mobile. Reverting is one import and re-chaining the calls.

**Input is validated with Zod before any request is made**
(`src/features/weather/model/place-query.ts`). The schema normalises first —
trimming and collapsing runs of whitespace, upper-casing the country — then
validates, so `"  kuala   lumpur "` and `"Kuala Lumpur"` reach both the
geocoder and the query cache identically. A comma typed into the city box is
caught specifically and answered with "Put the country in its own field."
rather than a generic format complaint.

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

**Readings cross-fade in place, and the card never changes height to do it.**
Every dynamic value — temperature, range, place, timestamp, humidity,
condition — renders through `ValueSwap`, which stacks the outgoing and
incoming text in a single grid cell. One line of text is exactly as tall as
one line of text, so the card holds its height throughout; measured across a
full switch it stays at a constant 188 px.

**The previous reading stays on screen while the next one loads,** dimmed to
50 %, rather than being replaced by a skeleton. The skeleton now appears only
for the very first search, when there is nothing to keep. Swapping a populated
card for a skeleton changed its height and dropped the illustration, so the
composition jumped twice per search; this was the larger half of the problem
the cross-fades were asked to solve.

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

**Values live inside an `aria-live` region, so the outgoing copy hides
itself.** For the length of a cross-fade two readings exist in the DOM; the
exiting one sets `aria-hidden` via `useIsPresent`, leaving exactly one for a
screen reader to announce.

## Scope

**No pagination.** React Query is used for caching, request de-duplication,
the retry policy and the loading/error state machine. The history list is
local and capped, so there is nothing to paginate.

**No routing beyond `/` and a 404.** The brief describes one page.
