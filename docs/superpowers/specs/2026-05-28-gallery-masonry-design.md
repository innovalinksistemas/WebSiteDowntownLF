# Gallery Masonry — Design Spec
Date: 2026-05-28

## Overview
A dedicated gallery page at `/galeria` for the La Fortuna Downtown hotel boutique website. Displays photos in a CSS Grid masonry-style mosaic layout (Gallery 1 style), with category filters and a full-screen lightbox.

---

## Architecture

| File | Purpose |
|------|---------|
| `src/data/gallery.json` | Image data: src, alt, category, colSpan, rowSpan |
| `src/components/Gallery.astro` | Masonry grid + filter buttons + lightbox (self-contained) |
| `src/pages/galeria.astro` | Page wrapper using `Layout.astro` |
| `src/styles/global.css` | BEM classes `.gallery-*` appended to existing file |
| `src/components/Header.astro` | Add "Galería" nav link |

---

## Data — `src/data/gallery.json`

```json
{
  "categories": ["Todas", "Hotel", "Habitaciones", "Restaurantes", "Actividades"],
  "images": [
    {
      "id": 1,
      "src": "https://images.unsplash.com/photo-...",
      "alt": "Descripción de la foto",
      "category": "Hotel",
      "colSpan": 2,
      "rowSpan": 2
    }
  ]
}
```

**Field rules:**
- `colSpan`: 1 or 2 (within a 4-column desktop grid)
- `rowSpan`: 1 or 2
- `category`: must match one entry in `categories` array
- `src`: Unsplash URL as placeholder; replace with real hotel photos later
- `alt`: descriptive text for accessibility

---

## Layout — CSS Grid Masonry

**Desktop (≥1024px):** 4 columns, `grid-auto-rows: 180px`, gap `4px`
**Tablet (640–1023px):** 2 columns, `grid-auto-rows: 200px`
**Mobile (<640px):** 1 column, `grid-auto-rows: 240px` (colSpan/rowSpan ignored — all span 1)

Each image cell:
```css
grid-column: span var(--col-span);
grid-row: span var(--row-span);
```

Image fills cell: `width: 100%; height: 100%; object-fit: cover`

Hover: subtle scale(1.04) via GSAP on mouseenter/mouseleave.

---

## Filter System

- Row of pill buttons at top of page: one per category
- Active state: solid background `#9b1c2d`, inactive: bordered outline matching site style
- On filter click:
  1. GSAP `gsap.to(hiddenItems, { opacity: 0, scale: 0.95, duration: 0.25 })` then `display: none`
  2. GSAP `gsap.fromTo(visibleItems, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.04 })`
- "Todas" shows all images

---

## Lightbox

Triggered by clicking any gallery image.

**Structure:**
- Full-screen overlay `position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.92)`
- Centered `<img>` with `max-width: 90vw; max-height: 85vh; object-fit: contain`
- `×` close button top-right
- `‹` / `›` navigation arrows left/right
- Image counter: "3 / 12" bottom center

**Interactions:**
- Open: GSAP `opacity 0→1` + `scale 0.92→1` on the image, `0.3s`
- Close: reverse animation, then `display: none`
- Keyboard: `Escape` → close, `ArrowLeft/ArrowRight` → navigate
- Mobile: touch swipe left/right to navigate (touchstart/touchend delta)
- Clicking the overlay backdrop closes lightbox

**Navigation wraps around** (last → first, first → last).

---

## CSS Conventions

- All new classes prefixed `.gallery-*` in BEM style
- Appended to `src/styles/global.css` with a section comment block
- Background: `#081015` (matches site dark theme)
- Filter buttons use existing site button styles for consistency
- No new CSS framework or library added

---

## Constraints

- No external masonry library (pure CSS Grid)
- No new npm packages (GSAP already installed)
- Work directly on `main` branch — no PR
- Placeholder images from Unsplash (landscape/nature/hotel themes to match La Fortuna aesthetic)
- ~20 placeholder images across 4 categories (5 per category approx.)
