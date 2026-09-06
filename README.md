# code.isaiart.com

Browser-based coding tools with a cassette-futurism interface. Static HTML, no
build step, no server, no accounts. Hosted on GitHub Pages at
[code.isaiart.com](https://code.isaiart.com).

## The tools

| | What it is |
|---|---|
| **[Code Editor](https://code.isaiart.com/editor/)** | Desktop editor. CodeMirror core, multi-file tabs, sandboxed live preview, Prettier formatting for HTML/CSS/JS/JSON, find & replace. |
| **[Mobile Editor](https://code.isaiart.com/mobile/)** | Touch editor. Installs to the home screen, works offline, autosaves as you type. |


## The interface

Two design languages, one class API. A page moves between them by swapping a
single `<link>`. **VECTOR** is what the site ships; **CASSETTE** is what it
grew out of, kept working.

### VECTOR — what's live

The graphic side of the era rather than the industrial one: NASA technical
manuals, wireframe vector displays, plotter output, Vignelli-grade colour
bands.

**One rule carries everything — it's DRAWN, not built.** Structure is a 1px
hairline, never a bevel. Emphasis is a flat colour block, never a highlight.
Depth does not exist; hierarchy comes from contrast and spacing. A control is
a labelled rectangle that inverts, not a cap that travels.

The six-band stripe is the identity mark — masthead rule, section divider, or
a spine down the edge of a panel.

### CASSETTE — the other one

Cassette futurism: Nostromo consoles, Apollo DSKY, 1979 Braun industrial
hardware. Not cyberpunk, not neon, not glassmorphism.

**One rule carries everything — two planes.** Every surface is either

- **chassis** — warm beige plastic. Beveled, screwed, labeled, casts shadow.
  Holds all the controls. Text on chassis is *engraved dark ink*, never glowing.
- **screen** — a recessed near-black well. Phosphor text only, scanlines and
  vignette included. Never sits flush; never casts an outward shadow.

They never blend. Controls live on chassis, information lives on screens.

Everything else follows from that: chunky keycaps with 2px of real travel,
rocker switches instead of pill toggles, LED lamps and seven-segment readouts
for status, label tape for names, hazard stripes on destructive controls.

### Dark and light

Both languages carry both. The site opens **dark**; a rocker on every page
throws it to **light**, and the choice persists across pages and sessions.

Light is not a third phosphor, it is the lights coming on. In VECTOR that
means the whole palette flips — ground, panels, rules, ink and the display
ramp invert together, at the same contrast ratios the dark mode measures. In
CASSETTE, where the chassis is already a light plane, only the display flips:
the recessed well stops emitting and becomes warm stock with ink on it.

The six stripe bands do not change. They are the identity mark, and they read
on stock the way they read on black.

Type is [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) for
headings only, and [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)
for everything else including code.

### Building on it

```
assets/vector.css     design system in use — tokens + every component class
assets/cassette.css   the other language, same class API — swap one <link>
assets/cassette.js    shared runtime — window.CAS
```

The stylesheet is the single source of truth for colour, depth, and motion.
Page-level CSS may only *compose* its primitives and reference its variables —
never hardcode a hex that duplicates a token, never redefine a component.

That rule is what makes light mode cost a token block rather than a rewrite,
so it is worth keeping literally. In particular, anything deriving a *stronger*
step from the display colour must mix toward `--phos-hi`, never toward a
literal white: in light mode that pole is black, because there emphasis means
more ink, and a hardcoded white inverts the whole ramp. Overlays follow the
same rule — `--wash` (a tint on a surface), `--scrim` (dimming behind a modal)
and `--cover` (a full-screen view) all move away from the current ground, so
none of them can be written as a fixed `rgba(0, 0, 0, …)`.

`window.CAS` covers what every page needs, so no page reimplements it:

| | |
|---|---|
| `CAS.toast(msg, isError)` | status readout |
| `CAS.copy(text)` / `CAS.paste()` | clipboard, with a fallback path |
| `CAS.download(name, text, mime)` | download that doesn't race the URL revoke |
| `CAS.openInTab(html)` | user code in a new tab |
| `CAS.renderPreview(iframe, html)` | **sandboxed** preview — always use this |
| `CAS.segInit(el, digits)` / `CAS.segSet(el, value)` | seven-segment readouts |
| `CAS.getTheme()` / `CAS.setTheme()` / `CAS.toggleTheme()` | dark ↔ light. The `…Phosphor` spellings still work — the archived tools call them |
| `CAS.bootOnce(el)` | CRT power-on wipe, once per tab session |
| `CAS.debounce(fn, ms)` | |
| `CAS.registerSW(path)` | offline support |

User code **never** runs unsandboxed and is **never** inserted with `innerHTML`.
Previews go through `CAS.renderPreview`, which uses an iframe with
`sandbox="allow-scripts"` and no `allow-same-origin` — the previewed page can
run its own JS but cannot reach this origin's storage or DOM.

Local state lives under a `codetools.` key prefix in `localStorage`, and every
read and write is wrapped — private mode and full-quota both degrade to
in-memory editing rather than breaking.

## Layout

```
index.html                 landing page
editor/                    desktop code editor
mobile/                    mobile editor (+ its own manifest)
assets/                    cassette.css, cassette.js, icons
archive/                   retired tools, kept as they were (not linked from the site)
sw.js                      service worker (bump CACHE on deploy)
manifest.webmanifest       site-level PWA manifest
404.html                   not-found page
CNAME                      GitHub Pages domain
```

## Running locally

Asset paths are relative, so you can double-click any `index.html` and it will
render — handy for a quick look. Service workers and the PWA install prompt are
inert on `file://`, so for anything beyond a visual check, serve it:

```bash
python -m http.server 8000
```

`404.html` is the one exception: its paths stay root-relative on purpose,
because GitHub Pages serves it at arbitrary URL depths.

After changing anything in `assets/`, bump `CACHE` in `sw.js` — otherwise
returning visitors keep getting the cached copy.

## About

Part of the [IsaiArt](https://isaiart.com) project.
