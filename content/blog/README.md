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
