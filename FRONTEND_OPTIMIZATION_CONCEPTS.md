# Frontend Optimization Concepts

Here is a list of the industry-standard optimization concepts that we implemented to make the Omnidevx website perform at an enterprise tier. These are the technical terms for "things you need but might not know the name of".

## 1. Cumulative Layout Shift (CLS) Mitigation
**What it is:** When elements on a webpage (like images or ads) load and suddenly push other content down, causing the page to "jump" or shift unexpectedly. This is highly penalized by Google SEO.
**How we fixed it:** We added explicit `width="20"` and `height="20"` attributes to all SVG icons. This tells the browser exactly how much space to reserve *before* the image even loads, preventing the page from shifting.

## 2. Lazy Loading
**What it is:** Postponing the downloading of non-critical resources (like images far down the page) until the user actually scrolls near them.
**How we fixed it:** We added `loading="lazy"` to the SVGs in the service pages. This saves initial bandwidth and ensures the critical, above-the-fold content loads much faster.

## 3. Asynchronous Image Decoding
**What it is:** Images require CPU power to decode before they can be displayed. If done synchronously on the main thread, it can freeze the browser momentarily.
**How we fixed it:** We added `decoding="async"` to your images, telling the browser to decode them in the background, keeping scrolling and UI interactions buttery smooth.

## 4. Link Prefetching
**What it is:** Secretly downloading the resources for the *next* page the user is likely to visit, so that when they finally click the link, the new page loads instantly.
**How we fixed it:** We configured Astro's `prefetch` config with a `hover` strategy. The exact moment a user hovers their mouse over a navigation link, the browser fetches it in the background.

## 5. Resource Prioritization (Preconnect)
**What it is:** Establishing early network connections to important third-party servers (like Google Fonts) before the browser even requests the actual CSS or font files.
**How we fixed it:** We added `<link rel="preconnect">` tags for Google Fonts in `Layout.astro`. This completely eliminates FOUC (Flash of Unstyled Content), preventing the page from loading with a default system font and then suddenly snapping to the correct premium font.

## 6. Debouncing
**What it is:** Delaying the execution of a heavy function until a certain amount of time has passed since the last time it was called. It prevents a function from firing too many times in a row.
**How we fixed it:** We added a 300ms debounce to the FAQ search bar. Now, when a user types rapidly, it only filters the results *once* they pause typing, rather than recalculating the list on every single keystroke. This prevents input lag.

## 7. Native Scroll Restoration (History API)
**What it is:** Remembering exactly where a user was scrolled on a previous page when they navigate "back", so they don't lose their place.
**How we fixed it:** We replaced hardcoded href links in the `GlobalTabbar` with `window.history.back()`. This triggers the browser's native scroll restoration behavior instead of forcing a full page reload.
