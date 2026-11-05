# ShopEasy

A responsive online shopping page built with plain HTML, CSS and JavaScript.
No libraries, no internet connection and no build step needed.

## Features

- Sticky navbar with Home, Shop, About and Contact links that highlight as you scroll
- Hamburger menu on phones
- Hero banner with "Shop Smarter, Live Better", a Shop Now button and slider dots (auto-rotates every 5 seconds, click a dot to jump)
- Product cards with price, star rating and **Add to Cart**
- Working cart: open it from the cart icon, change quantities, remove items, clear the cart and see the live total
- Cart badge shows the number of items, and the cart is saved in your browser
- Checkout button that completes a demo order (no real payment)
- Special Offers and Free Delivery banners
- Secure Payment, 24/7 Support and Easy Returns bar
- Contact form with validation
- Fits phones, tablets and desktops

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure |
| `style.css` | Layout, colours and responsive rules |
| `script.js` | Slider, cart, navigation and form logic |
| `README.md` | This guide |

Keep the three code files in the same folder with exactly these names.

## Run it

### Option 1: Double-click
Open `index.html` in any browser.

### Option 2: Local server (PowerShell)

```powershell
cd "C:\Users\-admin\Desktop\shopeasy"
python -m http.server 8000
```

Then open <http://localhost:8000>.
Press `Ctrl + C` in PowerShell to stop the server.

If `python` is not recognised, try `py -m http.server 8000`, or with Node.js installed: `npx serve .`

## How to use

1. Press **Add to Cart** on any product.
2. Click the cart icon in the navbar to review your items.
3. Use **+** and **-** to change quantity, or the red bin to remove an item.
4. Press **Checkout** to finish the demo order.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Page has no styling | Check `style.css` is in the same folder. Windows may have saved it as `style.css.txt`. Run `dir` to check. |
| Old version still showing | Hard refresh with `Ctrl + F5`. |
| Port already in use | Use another port, e.g. `python -m http.server 8080`. |
| Cart is empty after reopening | The cart is saved per browser. Clearing site data or private mode removes it. |

## Customising

- **Products:** edit the `PRODUCTS` list at the top of `script.js` (name, price, icon, colour, stars).
- **Hero text:** edit the `SLIDES` list in `script.js`.
- **Colours:** edit the variables at the top of `style.css`.
- **Slide speed:** change `5000` (milliseconds) in the `restart` function.
