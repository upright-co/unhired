# Animated infographics: looks

Every daily animated infographic (1080x1350, 4:5, seamless loop, rendered with
`scripts/render-animation.mjs`) must look clearly different from the last 7 in the log
below, while staying on brand.

## Always on brand (never change)
- Fonts: Sora (headlines), DM Sans (body), JetBrains Mono (labels, numbers, tags).
- Colours: ink #09070F, coral #F65663 / #FF8A94, violet #9452F2 / #B07CFF, white, mist #F4F2F8.
  Accents come only from coral and violet; any other colour is a tint of these.
- Unhired logo once, small and quiet so the video never reads as an ad: `height:24px; opacity:.7`
  in a corner (`../facebook/logo-ondark.png` on dark, the dark logo on light). Never bigger, never
  centred, never animated (Brandon, 2026-11-19).
- Wording follows content/WRITING.md: plain, specific, no selling, no pricing, no guarantee, no place names.
- render(t) is a pure function of time; the loop is seamless (last frame flows into the first).

## What must change from one to the next
Pick a different combination each day. Don't repeat the same **layout** within 7 days, and
don't use the same **background** two days in a row.

- **Layout / story shape**: card grid team · day timeline / clock · flow chart with moving
  tokens · before/after split screen · big-number counter with bar race · stacked checklist
  that ticks off · inbox/queue that empties · map of hand-offs (AI ↔ person) · donut/ring
  breakdown · step ladder / staircase · chat transcript · calendar week filling in.
- **Background**: ink dark with grid · flat mist light · solid coral · solid violet ·
  ink with a big coral/violet duotone shape · light paper with ink lines.
- **Motion style**: pop-in cards · draw-on lines · counting numbers · sliding conveyor ·
  typewriter text · camera pan across a wide canvas · pulsing nodes.
- **Type treatment**: huge headline top · headline on the left with content right ·
  big mono number as the hero · headline at the bottom.

## Log (newest first)
| Date | Slug | Layout | Background | Motion | Type |
|---|---|---|---|---|---|
| 2026-11-25 | ai-employee-roi | donut/ring breakdown (receptionist seat cost, 60% coral share, violet manager-time slice, break-even in the centre, legend rows below) | ink dark with grid (no glows) | draw-on arcs + counting centre number + typewriter final line + pulsing ring | headline at the bottom |
| 2026-11-24 | managing-ai-employees | big-number counter with bar race (manager's hours per week for weeks 1-12, three phases, phase card below) | ink with a big coral/violet duotone diagonal band | counting numbers + bars growing in sequence + pulsing active bar + cross-fading phase card | big mono number as the hero |
| 2026-11-23 | ai-employee-mistakes | flow chart with moving tokens (4 mistakes drop down a rail, each caught by a different layer, then a "fix the cause" banner) | flat mist light with white cards and ink catch slots | typewriter action line + falling dot on a draw-on rail + pop-in caught cards + pulsing nodes | huge headline top |
| 2026-11-22 | ai-patient-intake | chat transcript in a phone (patient and AI assistant, Thursday to Monday, two hand-offs to a person) beside a file-completeness meter | solid coral with ink cards | typewriter bubbles + scrolling thread + counting percent | headline on the left with content right |
| 2026-11-21 | ai-order-processing | stacked checklist that ticks off (6 checks, 3 orders: one passes, one asks the buyer, one goes to a person) | solid violet with ink cards | order ticket sliding in + draw-on ticks + pulsing active row | headline at the bottom |
| 2026-11-20 | ai-marketing-assistant | calendar week filling in (days as rows, 10 tasks, AI Employee vs manager cards, running totals) | light paper with ink lines and a coral margin rule | draw-on ruled lines + pop-in cards + counting totals | huge headline top |
| 2026-11-19 | ai-accounts-receivable | step ladder climbing bottom-left to top-right (5 reminders, last one to a person) | ink with a big coral/violet duotone circle | counting day number + cards sliding in with draw-on risers | big mono number as the hero |
| 2026-11-18 | ai-office-manager | inbox/queue that empties into two bins (AI Employee vs person) | flat mist light | sliding conveyor + cards morphing into rows | headline at the bottom |
| 2026-11-14 | ai-receptionist-day | day timeline / clock | ink dark with glows | typewriter + pop-in | huge headline top |
| 2026-11-14 | ai-employee-team | card grid team around a core ring | ink dark with grid | pop-in cards + pulsing ring | huge headline top |
