# How Unhired writes

This guide covers everything we publish: blog posts, LinkedIn articles and posts, captions, video scripts
and emails. The goal is writing that reads like Brandon explaining something to a business owner across a
table. Readers now spot AI-generated text fast and stop trusting it, so this matters as much as the facts.

Run the checker on anything before it goes out:

```
node scripts/check-writing.mjs <file.md> [more files]
```

It fails on hard tells and warns on soft ones. Passing is the minimum; reading it out loud is the real test.

Sources this guide draws on: Wikipedia's "Signs of AI writing", GPTZero's AI pattern research,
tropes.fyi by ossama.is, Marian Kamenistak's anti-AI writing guide (MIT) and Margaret Efron's list of
ChatGPT words.

## 0. Inform, don't sell

Articles (blog, LinkedIn, Medium, Substack) answer the reader's question with real expertise, in Brandon's
first-person voice (section 0b): what the role involves, how an AI Employee does it, where it needs a person,
how one is set up, what it costs and how to judge whether it fits. They share knowledge; they are never a
pitch for Unhired.

- Don't mention Unhired (apart from the one assessment pointer below), its guarantee, its pricing, or what
  "we" build, train or maintain. No "how we'd
  set one up", "we'd build it", "the clients we build for", "our free assessment".
- Write about the subject, not the seller: "How an AI Employee is set up", "How much an AI Receptionist
  costs", "Who maintains it", never "How we'd set one up" or "The most you'd pay".
- Costs: give the sourced wage and the full cost of a hire, explain how AI Employees are usually priced
  (software you assemble yourself vs. a provider that builds and maintains it, usually a monthly fee) and
  what drives the price. Tell the reader how to compare quotes. Never quote Unhired's price or guarantee.
- No sales lines: "what you'd save", "nothing up front", "you never have to touch it", "we replace the
  role, not the person".
- The byline is Brandon and articles are in his voice. It's never "I'd build this for you" or "my clients save".
- One subtle mention of the assessment is allowed per article, written as a neutral pointer, the way you'd mention a
  useful tool, with a link to `/assessment`. For example:
  "AI Employee assessments, such as [the one offered by Unhired](/assessment), can be a good place to start."
  or "Some websites offer [free assessments](/assessment) that check whether a role can be filled by an AI
  Employee." Put it where the reader is deciding whether their own role fits. Never "our", never a reason to
  buy, never more than once.
- The site adds its own Take Assessment box where `<!-- cta -->` sits. Kits leave it out of the LinkedIn,
  Medium and Substack copies.
- Captions for the Unhired company page may say "we wrote up..." about the article. They still don't pitch.

## 0b. Brandon's voice, written for everywhere

- Articles are written as Brandon, in the first person, as someone who has spent the last four years
  building AI systems and AI agents for businesses. "I read every posting the same way now", "I'd split the
  duties like this", "the step owners skip is the last one". Share what he'd know from doing the work:
  how a role breaks down, where AI does well, where it needs a person, what goes wrong in setup.
- Don't invent specific past builds, named clients, or results ("a client of mine saved 20 hours"). Opinions
  and judgment in his voice are fine; made-up case studies aren't.
- No cities, provinces, states or regions. Brandon sells to businesses everywhere, and a place name makes a
  post read as local. Say "a construction company", not "a construction company in Edmonton". Use national
  wage figures (BLS for the US, Job Bank's Canada-wide page for Canada), and never a regional page.

## 1. Be specific

The biggest tell is vagueness. AI gives the average answer, so it says "many businesses" and "significant
savings." We say "a construction company in Edmonton" and "$33.89 an hour."

- Every section needs at least one real detail: a number, a place, a tool name, a time of day, a form name.
- Messy, true details beat tidy, illustrative ones. "A missing TD1 and void cheque" is better than
  "missing paperwork."
- Only use numbers we can source, and name the source. Never "experts say" or "studies show."
- If a sentence would be equally true about any company, cut it or make it specific.

## 2. Say it plainly

Use the word you'd say out loud. "Use", not "leverage" or "utilize". "Is", not "serves as" or "stands as".
"Help", not "empower" or "facilitate". The checker carries the full list.

Never use these transitions: moreover, furthermore, additionally, consequently, nevertheless, notably,
importantly, interestingly, "it's worth noting", "that being said", "in conclusion", "in summary".
Start a new paragraph instead.

Drop adverbs that add nothing: seamlessly, effectively, efficiently, consistently, quietly, deeply,
fundamentally, truly.

## 3. Avoid the AI sentence shapes

These patterns are the strongest giveaways. One in a long piece can survive; the checker fails most of them.

- **The fake reframe.** "It's not X, it's Y." "X isn't A. It's B." "The question isn't X. The question is
  Y." "Not because X, but because Y." "Not just X, but Y." Just say what it is.
- **The countdown.** "Not X. Not Y. Just Z."
- **The self-answered question.** "The result? Devastating." "The best part? It's free." Make the
  statement instead.
- **False suspense.** "Here's the thing." "Here's the kicker." "Here's what most people miss." "Let's break
  this down." "Let's dive in."
- **The setup line.** "This one surprised me." "This is where it gets interesting." Show the surprising
  thing; don't announce it.
- **The "-ing" add-on.** "...highlighting the importance of X." "...reflecting a broader shift." Delete it.
- **The patronizing analogy.** "Think of it as a Swiss Army knife for your inbox."
- **"Imagine a world where..."** Describe what actually happens instead.
- **Stakes inflation.** "This changes everything." "A pivotal moment." Most things are useful, not
  historic.
- **Fake labels.** "The onboarding paradox." "The admin trap." If it needs a name, it needs an argument.

## 4. Vary the rhythm

AI writes in two modes: dense, even paragraphs, or a staircase of one-line fragments. Real writing mixes
lengths. A long sentence that carries a whole idea, then a short one. Paragraphs of different sizes.

- No runs of three or more fragments.
- Not everything comes in threes. Use two items, or four, or one. Never stack lists of three back to back.
- Don't start several sentences in a row the same way ("It sends... It tracks... It books...").
- Sections don't need equal length or identical shapes. If every section ends with the same bold label,
  vary it or cut it.

## 5. Open fast, end when you're done

- Start with the specific thing: the posting, the number, the moment. No warm-up paragraph.
- Don't summarize at the end of sections or at the end of the piece. No "Either way...", "The bottom
  line...", "At the end of the day...".
- End on the last useful thing, or one honest line, then the call to action if there is one.

## 6. Formatting

- No em dashes. Use a period, a comma or a new sentence.
- Bold is for one or two phrases a section at most. Never start every bullet with a bold label.
- Headings are fine in long articles and blog posts, because they're reference pieces. Captions and posts
  have none.
- No decorative emojis. One that points somewhere ("👇") is fine in a caption.
- No unicode arrows (→) in prose.
- In tables and images, the same rules apply to the words.

## 7. Take a position

AI hedges. We say what we think: which duties an AI Employee should own, which should stay with a person,
and why. Admit limits plainly and specifically, without a "despite these challenges" turn to optimism.

## 8. Our own words

- "AI Employee", always capitalised, never "AI hire" or "AI worker".
- The guarantee belongs on the website's sales pages (wording in `content/copy.ts`), never in articles.
- Brandon writes in the first person on LinkedIn. The company writes as "we".
- Examples span industries, never one trade.

## Before publishing

1. Run `node scripts/check-writing.mjs` and fix every error.
2. Read it out loud. Rewrite any sentence you wouldn't say to a client.
3. Check that each section has a real detail and that every number has a source.
