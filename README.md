# Trade Deadline War Room
### Bow Sports Capital · Track 201 · Module 1 · Lesson 2 — *Luxury Tax In Action*

A standalone, classroom-ready sports front-office simulation for 7th–8th graders.
Students step into the General Manager's chair at the NBA trade deadline, compare
real trade packages, watch their team metrics change live, handle a pressure
moment, lock in a strategy, and defend it to ownership.

No build step, no accounts, no server. Open `index.html` in any modern browser.

---

## The Lesson: Luxury Tax In Action
The luxury tax is a penalty teams pay when they spend past the **tax line**. The
further over they go, the bigger the penalty grows. This sim makes that concrete:
selecting a trade changes your payroll, and the **Luxury Tax Bill** is calculated
with the real progressive (and repeater) multipliers — students *see* the bill
explode as they chase wins. The three teams are tuned so the same kind of trade
costs wildly different amounts:

| Team | Cap situation | Lesson |
| --- | --- | --- |
| **San Antonio Spurs** | Far under the line | Can add a star and *still* stay under the tax |
| **Milwaukee Bucks** | Right at the line | One trade tips them into the tax |
| **Cleveland Cavaliers** | Deep past the second apron (repeater) | Every dollar is multiplied into a brutal bill |

## The Four Metrics
- **💰 Cash** — financial health (driven down by the luxury tax)
- **🏆 Wins** — how much a move helps you compete now
- **🤝 Chemistry** — how well the team fits together
- **🔥 Clout** — how excited fans, media, and sponsors are

## Student Flow
1. **Mission Briefing** → 2. **Set up your front office** (GM name + team) →
3. **Trade Deadline War Room** dashboard → 4. compare the **Trade Board** →
5. **live Team Impact** + live luxury tax bill → 6. **Pressure Moment** twist →
7. **Submit Strategy** → 8. **Performance Report** → 9. **Boardroom Memo** →
10. **Play Again**.

Each team's board has five strategic identities with no perfect answer:
**Star Swing · Depth Upgrade · Future Asset Play · Chemistry Saver · Stand Pat.**

---

## Project Structure
```
index.html          # all four screens + pressure modal
styles/game.css     # premium dashboard styling, fully responsive
scripts/data.js     # all content (teams, offers, tax config) — no logic
scripts/engine.js   # pure, testable logic (tax math, metrics, report)
scripts/storage.js  # safe localStorage wrapper (falls back to memory)
scripts/app.js       # DOM rendering + event wiring
tests/engine.test.js # Node test suite (no framework)
```

## Running Tests
```bash
node tests/engine.test.js
```
17 checks cover the luxury-tax math, metric clamping, strategy classification,
report building, blank-memo handling, and a balance check that no trade can push
a meter out of the 0–100 range.

## Manual QA Checklist (verified)
- [x] Full play-through start → report on each of the 3 teams
- [x] Pressure moment fires once after the first selection, then persists as a banner
- [x] Changing the selected trade repeatedly updates meters + tax bill correctly
- [x] Submit is disabled until a trade is chosen; nudges instead of crashing if empty
- [x] Blank Boardroom Memo saves as "No memo submitted yet."
- [x] Play Again resets the deadline; New Mission returns to the briefing
- [x] localStorage blocked → app still runs (memory fallback)
- [x] Narrow / mobile layout (single column) is usable
- [x] Long GM names and long text are clamped/wrapped, no overflow
- [x] No external image assets (emoji only) → nothing to break

## Highway World Compatibility
The report object exposes a flat, future-friendly shape (`simulationId`, `track`,
`module`, `lesson`, `selectedStrategy`, `strategyType`, `metrics`,
`luxuryTaxBill`, `boardroomMemo`, `completionResult`, …) so this can later become
a Highway World mission without restructuring. See `SIM_META` in `scripts/data.js`.

## Known Limitations / Follow-ups
- Numbers are authored for clarity, not full NBA cap-rule accuracy (intentional for this age group).
- Report state is not persisted across a refresh *on the report screen* (by design — each deadline is a fresh run); GM name and team selection are restored.
- A future version could let students compare two offers side-by-side or add a second pressure round.
