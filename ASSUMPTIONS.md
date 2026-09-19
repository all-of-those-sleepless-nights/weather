# Assumptions

The brief invites UI-behaviour assumptions to be stated separately. These are
the decisions that were not fully determined by the requirements or the
mockup, with the reasoning behind each.

## Search input

**One field accepting `City, Country`, with the separator typed for you.**
The mockup shows a single field float-labelled "Country", while requirement 2
asks the user to input a city *and* a country name. The field takes both and
splits on the first comma; the visible label reads "City, Country" so the
format is discoverable without relying on the placeholder.

**The whole pill is the label,** so clicking anywhere inside it focuses the
field rather than only the line the text sits on.

**Any character that cannot appear in a place name becomes the separator**
(`src/features/weather/model/place-input-mask.ts`), and only the first one
survives — a second does nothing rather than building a query no geocoder can
answer. So `Johor/MY`, `Johor;MY` and `Johor,MY` all arrive the same way and
the comma never has to be reached for deliberately.

Letters in any script, spaces, and the hyphen and apostrophe that turn up in
"Stratford-upon-Avon" and "L'Aquila" are kept. Everything else — including
digits and the full stop — is treated as a separator. Because the mask is a
left-to-right scan, masking the text before the caret gives its new position
exactly, so editing mid-string does not throw the cursor to the end.

**The full stop is not a place character**, although "St. Louis" contains
one. It is punctuation the name can do without — the geocoder answers
"St Louis" — and keeping it meant the most obvious special character was the
one the mask let through. The cost is stated plainly: typing `St. Louis` now
yields `St, Louis`, and that city has to be entered without the stop. The
hyphen and apostrophe stay, because "Stratford-upon-Avon" and "L'Aquila"
cannot be typed at all without them.

No space is inserted after the separator. Auto-inserting one makes backspace
appear broken: deleting the space leaves an input the mask immediately
restores. Typing a space is preserved, and whitespace is collapsed before the
value is used.

**The country is optional and free-form.** `Singapore` works as well as
`Singapore, SG`, and the geocoder resolves `Malaysia` as readily as `MY`, so
the spelled-out name is accepted rather than rejected in favour of an ISO
code. The place shown on the card comes from the geocoder's response, so a
search for `Johor, Malaysia` still displays `Johor, MY`.

**Input is validated with Zod before any request is made**
(`src/features/weather/model/place-query.ts`). The schema normalises first —
trimming and collapsing runs of whitespace — then validates, so
`"  kuala   lumpur "` and `"Kuala Lumpur"` reach both the geocoder and the
query cache identically. It repeats the rule the mask already enforces,
because the schema is the boundary the rest of the app trusts and has to hold
for a pasted or programmatic value too.

**Zod is imported as `zod/mini`.** Same validators, composed with `z.pipe`
instead of method chaining, and tree-shakeable. Measured on this bundle the
full package costs 24.2 kB gzipped against 5.5 kB for mini — a 13 % swing on
a 145 kB bundle for validating one form, which is not a good trade on mobile.
Reverting is one import and re-chaining the calls.

**A validation message shows for two seconds and fades.** It is a prompt to
fix a keystroke, not a state of the page: once it has been read it is only in
the way of the field it points at. Raising the same message again restarts
the clock, so submitting an empty field twice shows it twice rather than
appearing to do nothing. It is positioned out of flow beneath the field —
something on screen for two seconds should not push the card down and pull it
back up again.

**A clear button appears once there is something to clear.** It sits over the
pill's right padding as a sibling of the label rather than inside it: a
button nested in a label is invalid HTML, and a click on it would then count
as a click on the label as well. Clearing returns focus to the field, since
it is the start of retyping rather than the end of the interaction.

## Layout

**The page scrolls as one document.** The card grows with its history rather
than pinning itself to the viewport and scrolling a panel inside itself. A
card that fills the screen whatever it contains is mostly empty space on a
first visit, and an inner scroll region is a second thing to scroll on a
phone that already scrolls.

**A button in the bottom-right corner returns to the top**, appearing only
once the page has moved more than 240px so it never covers a card that fits.
It is fixed to the viewport and floats over the page's bottom padding rather
than reserving a band of its own.
It scrolls through the same Lenis instance that owns the page's smooth
scrolling — a native smooth scroll running against Lenis's own loop reads as
a stutter — and falls back to an instant native scroll when reduced motion
has turned Lenis off.

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

**With no reading, the values are left out rather than filled in.** Before the
first search, and after a failed one, the card shows its heading, its
illustration and one line saying why there is nothing there. A column of
dashes was tried and removed: it is noise that reads as a broken card rather
than an empty one.

**The loading skeleton went with it.** The previous reading stays on screen,
dimmed, while the next loads, so the only case a skeleton covered was the
very first search — one frame of grey bars before the card fills in.

**The error message sits in the card's status line**, under the heading,
rather than replacing the card. Its width is capped short of the
illustration, which overlaps the top-right corner and would otherwise swallow
the end of a long message.

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

**Without a reading the illustration is a line glyph:** a plain cloud while
there is nothing to show, a struck-through cloud in the error colour when a
lookup failed. Using one of the two weather images would claim a sky the app
has not been told about. Both glyphs are decoration and carry no text
alternative — the card's own line already says what happened, and a screen
reader should not hear it twice.

**The glyphs are sized by their ink, not by the image's box.** Measured on
the supplied PNG, the solid cloud fills 87 % of the file's width and 72 % of
its height; the rest is transparent margin and the glow baked into the image.
A glyph given that same box therefore draws half as big again and crowds the
card. Each is sized so its drawn extent matches the illustration's instead,
and the struck-through cloud is smaller still because its diagonal reaches
both corners while the plain cloud sits in the middle.

**Backgrounds were re-encoded as JPEG** (roughly 900 KB each as supplied,
about 160 KB after). A flat colour sits behind them so layout never depends on
an image loading.

## Theme

**The switcher leads the search row**, built to the same square as the submit
button that closes it — filled violet for the control that submits the form,
glass for the one that only changes how the page looks. It was a floating
corner button before; in the row it reads as part of the same control strip
and costs no vertical space on a phone.

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
50 %, rather than being replaced by a skeleton — there is no skeleton any
more. Swapping a populated card for one changed its height and dropped the
illustration, so the composition jumped twice per search; this was the larger
half of the problem the cross-fades were asked to solve. The placeholders
hold the same shape without the second layout.

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
