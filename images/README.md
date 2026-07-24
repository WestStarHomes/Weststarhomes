# Images

Drop project photos, banners, and the logo here.

## Suggested files
- `logo.svg` (or `logo.png`) — company logo. Once added, replace the `.brand-mark` span in `index.html` with `<img src="images/logo.svg" alt="West Star Home LTD" />`.
- `banner-1.jpg`, `banner-2.jpg`, `banner-3.jpg` — hero carousel (recommended: 1920×900, JPEG).
- `portfolio-1.jpg` … `portfolio-6.jpg` — portfolio grid (recommended: 1200×900, JPEG).

## Swapping banner placeholders
In `css/styles.css`, replace each `.slide-N` background rule with e.g.:

```css
.slide-1 {
  background: url("../images/banner-1.jpg") center / cover no-repeat;
}
```

## Swapping portfolio placeholders
In `css/styles.css`, replace each `.p-N` rule and remove the `.portfolio-placeholder` div from that item, e.g.:

```css
.p-1 {
  background: url("../images/portfolio-1.jpg") center / cover no-repeat;
}
```
