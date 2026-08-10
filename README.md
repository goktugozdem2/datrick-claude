# Datrick website

Static source for [datrick.com](https://datrick.com). The site uses plain HTML,
one shared stylesheet, and small JavaScript modules. It is hosted on Vercel and
does not require a build step.

## Local checks

```sh
npm test
npm run audit:content
npm run audit:links
```

Serve the repository root with any static HTTP server for browser testing. The
contact endpoint lives in `api/contact.js` and requires the Vercel runtime for a
complete delivery test.

## Routing

`vercel.json` is the source of truth for redirects and clean route rewrites.
All public canonicals use `https://datrick.com`. Requests to the `www` hostname
redirect permanently to the equivalent apex path.

## Publishing

Production publishing is a separate, manual step. Merging a pull request does
not deploy this repository automatically. Review routing, the sitemap, tests,
and any `[NEEDS INPUT: ...]` placeholders before a release.

The generated live-site audit and the database landing-page summary are in
`docs/`.
