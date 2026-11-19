# Brandon's personal posts: 10 a day

Goal: when people in Alberta think "AI", they think of Brandon Upright. Ten posts a day, every day,
each one posted on his personal Facebook, LinkedIn and X. It is a high-volume content funnel:

    image + headline  →  caption  →  article on unhired.io (linked in the first comment)  →  author box: book a call

**The content never sells Brandon, Unhired or the service.** Posts, captions and articles exist to earn
attention, start conversations and give the public useful information. The only offer anywhere is the
"About the author" box the site adds to the end of every article. Never write a pitch, a price, a
guarantee, "we build" or "book a call" into a post, a caption or an article body.

He pastes from the portal's Posts tab (app.unhired.io/posts) and ticks each platform.

These are personal posts, so the article rule about place names doesn't apply: Alberta, Edmonton and
Calgary are the point. Everything else in `content/WRITING.md` applies (no AI tells, no em dashes,
sourced numbers, no invented stories about Brandon or his clients).

## Who it is for

The everyday person in Alberta, and business owners. Assume the reader has never opened ChatGPT and
doesn't follow tech news. Test every story with: would someone at a hockey rink in Leduc care, and
would they have an opinion?

- Industry-insider news (funding rounds, model launches, a tech CEO resigning) fails that test on its
  own. Skip it, or make the post about the reader: "The company behind Claude is now worth $1.5
  trillion. What that means for your business."
- Explain every term in passing ("Anthropic, the company that makes Claude, an AI assistant that
  competes with ChatGPT"). No jargon: no tokens, models, agents, benchmarks, APIs.
- Health care, power bills, jobs, kids and school, scams, farmland, small-business money, local
  companies and local events are the subjects that travel.

## The three priorities for every post (Brandon's, in order)

1. The headline gives someone a reason to comment.
2. It pulls them into the conversation.
3. The photo makes them stop and stare.

So the headline is a question the reader can answer from their own life, or a stake they have an
opinion on: "Would you live 600 metres from an AI data centre?", "Waiting on an MRI in Alberta?",
"Fewer than 1 in 5 Alberta businesses use AI. Does yours?", "Fair?". It still carries the number.
Never a clever line, never a teaser with no fact in it.

## The daily mix (10)

| Pillar | Count | What it is |
| --- | --- | --- |
| `alberta` | 4-5 | Alberta AI news and numbers: government, health, schools, power and data centres, Amii, U of A, U of C, Alberta companies, events. Canada-wide news counts when the post says what it means here. |
| `ai_news` | 2-3 | World AI news, only when it can be tied to the reader's wallet, job, family or business. |
| `ai_employee` | 3 | One useful idea from an unhired.io/blog article, framed as a problem the reader has ("Customers paying you late?"), never as a product. |

Never the same pillar twice in a row. Slot 1 is the strongest story of the day. Don't repeat a story
from the last 7 days of files in this folder unless there is a new fact.

## The caption (`body`, for Facebook and LinkedIn), 110-170 words

- Line 1 is the headline's question or stake with the fact in it.
- Then one fact per line, one or two sentences each, a blank line between them. Plain words.
- One line on what it means for the reader, when there is an honest one.
- Then a question that is easy to answer from experience ("How long did you wait for an MRI?",
  "Yes or no, and why?"). This is what earns comments.
- Then "Follow Brandon Upright for AI updates like this every day."
- Last line: "The full story is in the first comment."
- No links, hashtags or emojis in the body.

`x`: 280 characters at most. The hook, the two best facts, the question.

`first_comment`: "Full story: https://unhired.io/news/<slug>" (or, for AI Employee posts,
"Full article: <title> https://unhired.io/blog/<slug>"). First comment on Facebook and LinkedIn, a
reply on X.

`title`: a short label for the portal card.

## The article (every news post gets one)

`article` in the day file: `title`, `description` (one or two sentences), `body` (a list of Markdown
blocks: paragraphs, `## Headings`, `- bullets`) and `sources` (`label` + `url`). 350-550 words.
`scripts/news-publish.mjs` turns it into `content/news/<slug>.md`, live at unhired.io/news/<slug>.

- It gives the full story a curious reader wants after the post: what happened, the numbers, who is
  affected, what critics say, what it means for you, what to watch next.
- Written as Brandon, first person where he has a view ("the part I'd watch is..."). He has built AI
  systems for businesses for four years. Opinions are welcome; invented experiences, clients and
  results are not.
- It ends on the last useful thing. No sign-off, no pitch, no "book a call": the page adds the author
  box by itself.
- The slug is plain words for search ("alberta-mri-ai-more-scans"), never reused.
- AI Employee posts don't get a new article: set `link` to the existing blog article instead
  (`"link": "<Article title> https://unhired.io/blog/<slug>"`).

## Facts

- Every number, name, date and quote comes from a page you opened today: a government release, the
  company's own page, a filing, or a major outlet. Aggregators and newsletters are leads, never sources.
- If two sources disagree or you can't open the primary page, leave that fact out.
- Allegations are written as allegations. Never tell anyone to buy, sell or hold a stock.

## The image

One per post, 1080x1350, rendered by `scripts/post-image.mjs` from the post's `image` spec (the spec
format is at the top of that file). The image headline is the post's hook in 10-16 words with the
number in yellow (`*600 metres*`). Labels: `ALBERTA AI UPDATE`, `AI UPDATE`, `AI EMPLOYEE`,
`CANADA AI UPDATE`.

- **Every post gets a photo when one exists** (Brandon: "images are a must"). For news posts, take the
  story's own picture: `node scripts/og-image.mjs <source urls>` prints each article's lead image. Put
  it in the spec as `photoUrl` with `credit` ("Photo: Global News", "Photo: Government of Alberta").
  Pick the most striking one among the post's sources: protest signs, a building, a person speaking.
  Then open the PNG and check the picture really shows the story.
- Skip an image when its URL or caption says Getty, AP, Reuters or The Canadian Press (agencies bill
  for reuse), when it is only a site logo or share card, or when it shows a person the post doesn't
  name. Two posts in one day never share a photo. No photo left? Use `stat` (the story is a number)
  or `list` (duties or rules).
- AI Employee posts use the robot photos in `brand/ads/photos` (`"layout": "photo", "photo": "robot-desk-b.png"`),
  a different one for each post that day.
- Generated photos (Fal.ai): not set up yet. When `FAL_KEY` exists in the portal's `.env.local`, this
  section gets the command for generating a photo or editing a source photo. Until then, don't
  generate images.
- Rotate themes so neighbours differ. Open every PNG and look at it: nothing cut off, the number
  readable on a phone, the label matching the pillar.

## Files and commands

- `content/personal-posts/<YYYY-MM-DD>.json`: `{ "date", "posts": [ { "slug", "pillar", "title", "body",
  "x", "first_comment", "sources": [], "image": {}, "article": {} or "link": "" } ] }`.
  `2026-11-19.json` is the model.
- `node scripts/post-image.mjs content/personal-posts/<date>.json [slug]` → `brand/personal-posts/<date>/<slug>.png`
- `node scripts/check-writing.mjs --places-ok <scratch.md>` on captions, X texts and articles.
- `node scripts/news-publish.mjs content/personal-posts/<date>.json` writes the article files and
  prints the paths to commit. Articles go live when `main` is pushed.
- `node --env-file=/Users/user/Documents/unhired-portal/.env.local /Users/user/Documents/unhired-portal/scripts/add-posts.mjs <day.json> <images-dir>`
  uploads the images and puts the day on the Posts tab. `--status [date]` prints what has been posted.
