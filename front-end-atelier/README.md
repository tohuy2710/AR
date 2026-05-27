# Front-End Atelier

React + Vite frontend for the Atelier showroom app.

## Prerequisites

- Node.js
- npm

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app runs at:

```text
http://localhost:3000
```

Useful checks:

```bash
npm run lint
npm run build
```

## Updating Mock Product Data

Product mock data lives in:

```text
src/data.ts
```

After editing `INITIAL_PRODUCTS`, restart or refresh the frontend. The app also stores products in browser `localStorage` under this key:

```text
atelier_products
```

Important behavior:

- Adding a product with a new `id` will be merged into existing browser data automatically.
- Editing an existing product in `data.ts` may not appear immediately if the old product is already saved in `localStorage`.
- To force the browser to reload products from `data.ts`, open DevTools Console and run:

```js
localStorage.removeItem('atelier_products');
location.reload();
```

If you changed reviews, cart, orders, wishlist, or user state and need a full reset, clear the related keys:

```js
localStorage.removeItem('atelier_reviews');
localStorage.removeItem('atelier_cart');
localStorage.removeItem('atelier_orders');
localStorage.removeItem('atelier_wishlist');
localStorage.removeItem('atelier_user');
location.reload();
```

## Static Assets

Files referenced by URL paths like `/models/chair.glb` or `/images/lounge-chair.png` must be placed inside `public`:

```text
public/models/chair.glb
public/images/lounge-chair.png
```

Vite serves `public` files from the site root, so `public/models/chair.glb` is loaded as `/models/chair.glb`.
