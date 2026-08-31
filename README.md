# SHOP

Efficient Fashion — a clean, modern storefront starting point.

## What's here

A static HTML/CSS/JS site: a homepage with a hero, a product grid (placeholder
items in `js/script.js`), a brand/about section, and a newsletter signup —
styled with a minimal, high-end aesthetic (serif headings, warm neutral
palette).

No build step required.

## Running locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html      — page markup
css/styles.css  — design system + layout
js/script.js    — product data + interactivity (cart count, mobile nav, form)
```

## Next steps

- Decide on the shop's actual niche/products and swap the placeholder items
  in `js/script.js`.
- Replace the placeholder product tiles with real photography.
- Wire up a real cart/checkout flow (and a backend) once the direction is set.
