# SEO fixes

Live site: https://maaidni.com

Checked on 19 October 2026 against the production HTML, `robots.txt`, and `sitemap.xml`. The Next.js build was healthy. Google was being sent to the Magic Portfolio demo domain instead of this site.

## What was wrong

- `baseURL` was still `https://demo.magic-portfolio.com`.
- Open Graph and Twitter image URLs used that demo domain.
- JSON-LD page URLs used that demo domain.
- `robots.txt` advertised `https://demo.magic-portfolio.com/sitemap.xml`.
- Every `<loc>` in the sitemap used the demo domain.
- Pages had no canonical URL. The Once UI metadata helper only emits a canonical when language alternates are passed, and none were.
- The site-wide schema still described an Organization named Once UI, with `lorant@once-ui.com` and Once UI social profiles. Those values were never rendered.
- The homepage was only a `WebPage`. There was no `Person` or `WebSite` entity.
- `/blog` was marked up as a `BlogPosting`, which is the type for one article, not a listing.
- Project pages were marked up as `BlogPosting` instead of `Article`.
- `/contact` is in the navigation but was missing from the sitemap.
- Static sitemap dates were regenerated on every build, so Google was told those pages changed on every deploy.
- `robots.txt` had no allow or disallow rules.
- `/api/*` (auth, Open Graph, RSS) could be crawled as normal pages.
- The disabled gallery could still be indexed if a URL was discovered.
- The 404 page inherited the homepage title and was indexable.
- Project covers used `alt="image"`. The logo used `alt="Logo"`. Gallery photos used `alt="image"`. The Acwady experience image said "Once UI Project".
- Project Open Graph images ignored the cover in `images` and fell back to a generated image whose title was not URL-encoded.
- RSS links used the demo domain, the feed was served as generic XML, and titles were not escaped.
- The contact form lived on the homepage as a second `h1`.
- Home, blog, and work descriptions were the template leftovers and said very little about the actual work.

## What changed

- Canonical origin is `https://maaidni.com` in `src/resources/once-ui.config.ts`.
- `src/utils/seo.ts` builds absolute URLs, canonicals, Open Graph, Twitter cards, author, locale, `siteName`, and robots directives for every page.
- Each page advertises the RSS feed with `rel="alternate"`.
- `src/components/seo/SiteJsonLd.tsx` adds `Person` and `WebSite` JSON-LD, including Casablanca, job title, and the real GitHub, LinkedIn, and Instagram profiles.
- Page JSON-LD now matches the page type: `WebPage` for listings, `BlogPosting` for articles, `Article` for projects.
- `src/app/sitemap.ts` lists `/`, `/about`, `/work`, `/blog`, `/contact`, every blog post, and every project on `https://maaidni.com`. The hidden gallery stays out. Posts keep their real publish dates. Priorities and change frequencies are set.
- `src/app/robots.ts` allows `/`, blocks `/api/`, and points the sitemap and host at `https://maaidni.com`.
- Gallery metadata is `noindex, follow`.
- The 404 page is `noindex, nofollow` and has its own title.
- Alt text was corrected for the logo, project covers, gallery photos, and the Acwady cover.
- RSS is `application/rss+xml`, escaped, and linked to `https://maaidni.com`.
- Titles and descriptions for home, blog, and work now describe Abdelhamid Maaidni’s actual work.
- The contact page has one `h1`. The form heading on the homepage is an `h2`. Email, subject, and message fields have accessible names.

## After deploy, confirm

Open these and check that every URL says `maaidni.com`, not `demo.magic-portfolio.com`:

- https://maaidni.com/
- https://maaidni.com/robots.txt
- https://maaidni.com/sitemap.xml
- View source on the homepage and search for `canonical` and `application/ld+json`

## Add the site to Google Search

1. Deploy this branch to the Vercel project that serves `https://maaidni.com`. Wait until the new deployment is live.
2. Open [Google Search Console](https://search.google.com/search-console).
3. Add a property. Choose **URL prefix** and enter `https://maaidni.com`.
4. Verify ownership with the DNS method. Google gives you a TXT record. Add it at the root of `maaidni.com` (host `@`) in the place you manage DNS, then click **Verify**. DNS can take a few minutes.
5. After verification, open **Sitemaps** and submit:

   `https://maaidni.com/sitemap.xml`

6. Open **URL inspection**, enter `https://maaidni.com/`, and click **Request indexing**. Repeat for `/about`, `/work`, `/blog`, and `/contact`.
7. Leave the site. Indexing is not instant. Check **Pages** in Search Console after a few days.
8. Optional: in [Google Analytics](https://analytics.google.com) create a GA4 property and add the measurement ID if you want traffic numbers. Search Console does not need Analytics to index the site.

Do not submit `https://demo.magic-portfolio.com`. That domain is the template, not this portfolio.
