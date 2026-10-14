# Blog posts

Each `.md` file here is a post at `/blog/<filename>`. The filename is the URL slug, so pick it for the search term (`what-is-an-ai-employee`, not `post-1`) and never rename a published post.

## Frontmatter

| Field | Required | What it does |
|---|---|---|
| `title` | yes | The H1 and share-card title |
| `seoTitle` | no | The `<title>` tag shown in Google. Keep it under ~60 characters where possible |
| `description` | yes | Meta description and intro line. ~150–160 characters |
| `keyword` | yes | The search term the post is written to rank for |
| `category` | no | Eyebrow above the title |
| `author` | no | Key from `content/authors.ts` (default `unhired`) |
| `published` / `updated` | yes / no | `YYYY-MM-DD`. Bump `updated` when you meaningfully refresh a post |
| `pillar` | no | `true` features it at the top of /blog |
| `draft` | no | `true` shows it in `npm run dev` only, never in production |
| `definition` | no | `{ term, text }` box under the title, for "what is" posts |
| `takeaways` | no | Bullet list under the title |
| `faq` | no | `[{ q, a }]` rendered at the end and emitted as FAQPage schema |
| `related` | no | Slugs of posts to link under "Keep reading" |

## In the body

- Use `##` for main sections (they become the "On this page" menu) and `###` below that.
- `<!-- cta -->` on its own line drops in the Take Assessment block. Use it once or twice per post.
- Link to other posts with `/blog/<slug>` and to the assessment with `/assessment`. Every post should link to the pillar (`/blog/what-is-an-ai-employee`) using the words "AI Employee".
- Only state numbers you can source, and link the source.

## Images and infographics

Long-form posts carry their own images, rendered from HTML templates (no credits):

1. Write `content/images/<slug>.json` (image types and fields are documented at the top of `scripts/article-images.mjs`).
   Start with a `cover`; add 3-7 infographics that each carry real information (a breakdown, a cost comparison, a day on shift, a process, a table, numbers with a source).
2. `node scripts/article-images.mjs <slug>` writes `public/blog/<slug>/NN-name.jpg`. Open each one and check nothing overflows.
3. Put each image on its own line in the body: `![Alt text that describes it](/blog/<slug>/02-breakdown.jpg)`.

Don't use Markdown tables in new posts: LinkedIn, Medium and Substack can't show them. Use a `table` image instead.

## Republishing (LinkedIn, Medium, Substack)

unhired.io is always the original. Add a `syndication` block to the frontmatter:

```yaml
syndication:
  cover: /blog/<slug>/01-cover.jpg
  linkedin_title: "Title for the LinkedIn newsletter article (can differ from the blog title)"
  substack_subtitle: "One line under the Substack title"
  tags: ["Artificial Intelligence", "Small Business", "Future Of Work", "Automation", "..."]   # Medium, max 5
  share_text: |
    The post LinkedIn shows in the feed with the article. First person, no links.
  page_caption: |
    Caption for the Unhired LinkedIn page and Facebook page, "we" voice. The kit adds the link.
```

Then `node scripts/publish-kit.mjs <slug>` writes `public/kits/<slug>.html` (live at `https://unhired.io/kits/<slug>.html`,
noindex). The portal Content tab links to it from each blog row. Copies go out 3 days after the blog post so Google indexes
ours first; Medium's importer also sets the canonical link back to unhired.io.

## Writing

Every post must pass `node scripts/check-writing.mjs content/blog/<slug>.md` with no errors. The rules are in `content/WRITING.md`.
