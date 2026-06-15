/* =============================================================
   Bow Sports Capital — Track 201 · Module 1 · Lesson 2
   "Luxury Tax In Action" → Trade Deadline War Room
   -------------------------------------------------------------
   This file holds ALL simulation content (no logic).
   Numbers are authored to be clean for 7th-8th graders:
   no decimals, no hidden formulas.

   The luxury tax is REAL math (see engine.js) so students can
   watch "Luxury Tax In Action": every dollar a team spends over
   the tax line gets multiplied into a bigger penalty.
   ============================================================= */

/* Lightweight identity so this can later plug into Highway World. */
const SIM_META = {
  simulationId: 'bsc-201-m1-l2-trade-deadline-war-room',
  track: '201',
  module: 'Module 1',
  lesson: 'Lesson 2',
  topic: 'Luxury Tax In Action',
  missionTitle: 'Trade Deadline War Room',
  highwayWorldLocation: 'Front Office Tower — Trade Deadline Floor',
  version: '3.0'
};

/* Real (simplified) 2025-26 style luxury tax thresholds, in $millions.
   Kept whole-number friendly. Used by engine.computeLuxuryTax(). */
const TAX = {
  taxLine: 171,      // spend past here and the tax penalty begins
  firstApron: 178,   // first warning line for big spenders
  secondApron: 189,  // the danger zone — penalties get severe
  // Each step is a $5M band over the tax line. The rate climbs as
  // you spend more — that is the "multiplier" students should feel.
  brackets: [1.5, 1.75, 2.5, 3.25, 3.75, 4.25, 4.75, 5.25],
  overflowRate: 5.75 // applied to anything past the last band
};

/* The four meters. Order matters for layout. */
const METRICS = [
  { key: 'cash',      label: 'Cash',      icon: '💰', help: 'How financially healthy your team is. Big contracts trigger the luxury tax and drain Cash.' },
  { key: 'wins',      label: 'Wins',      icon: '🏆', help: 'How much this move helps your team compete right now.' },
  { key: 'chemistry', label: 'Chemistry', icon: '🤝', help: 'How well the team fits together on and off the court.' },
  { key: 'clout',     label: 'Clout',     icon: '🔥', help: 'How excited fans, media, and sponsors are about your team.' }
];

/* Strategic identities every team's trade board is built from.
   There is intentionally NO perfect option. */
const STRATEGY_TYPES = {
  starSwing:     { type: 'Win-Now Strategist', identity: 'Star Swing' },
  depthUpgrade:  { type: 'Balanced Builder',   identity: 'Depth Upgrade' },
  futureAsset:   { type: 'Future Planner',     identity: 'Future Asset Play' },
  chemistrySaver:{ type: 'Chemistry Keeper',   identity: 'Chemistry Saver' },
  standPat:      { type: 'Safe Operator',      identity: 'Stand Pat' }
};

/* Three franchises with very different cap situations so students
   can see how the SAME kind of trade costs wildly different amounts
   depending on how much you already spend. */
const TEAMS = [
  /* -------------------- MILWAUKEE BUCKS -------------------- */
  {
    id: 'bucks',
    name: 'Milwaukee Bucks',
    emoji: '🦌',
    colors: { primary: '#00471b', secondary: '#eee1c6' },
    tag: 'Win-Now Window',
    difficulty: 'Balanced',
    situation: 'Your superstar is in his prime, but the roster is aging and you are sitting right at the luxury tax line. One trade could tip you over.',
    needs: ['A reliable scorer', 'Wing depth', 'Stay near the tax line'],
    basePayroll: 168,        // just UNDER the tax line (171)
    isRepeater: false,
    baseline: { cash: 55, wins: 50, chemistry: 60, clout: 58 },
    pressure: {
      title: 'Ownership wants a playoff push',
      body: 'Your owner just told the media: "We expect to make a deep playoff run THIS year." Standing still will not satisfy them — but chasing wins could push you deep into the luxury tax.',
      note: 'Win-now and high-excitement moves now matter more to ownership.'
    },
    offers: [
      {
        key: 'starSwing',
        partner: 'Trade with the Chicago Bulls',
        acquire: ['All-Star scoring guard'],
        giveUp: ['Two role players', 'A future 1st-round pick'],
        salaryChange: 24,
        deltas: { cash: -28, wins: 30, chemistry: -14, clout: 30 },
        pressureDeltas: { cash: -2, wins: 4, chemistry: 0, clout: 6 },
        risk: 'High', futureFlex: 'Lower',
        blurb: 'Bring in a star scorer. Huge excitement and a real shot to win now — but the salary blows past the tax line and the locker room has to adjust.',
        outcome: 'Your team became a contender and the city is buzzing — but the tax bill is enormous and your future picks are gone.',
        ownerReaction: 'Ownership loves the bold swing for the title, even with the giant tax bill.'
      },
      {
        key: 'depthUpgrade',
        partner: 'Trade with the Utah Jazz',
        acquire: ['Two-way rotation wing'],
        giveUp: ['A bench player', 'A second-round pick'],
        salaryChange: 8,
        deltas: { cash: -10, wins: 16, chemistry: 8, clout: 8 },
        pressureDeltas: { cash: -1, wins: 3, chemistry: 0, clout: 2 },
        risk: 'Low', futureFlex: 'Medium',
        blurb: 'A steady two-way wing who fills a real need. Not flashy, but a clean fit that nudges you just over the tax line.',
        outcome: 'A smart, low-drama upgrade. The team got better in a balanced way without breaking the bank.',
        ownerReaction: 'Ownership respects the disciplined move, though some fans wanted a bigger splash.'
      },
      {
        key: 'futureAsset',
        partner: 'Trade with the Oklahoma City Thunder',
        acquire: ['A young prospect', 'Two future 1st-round picks'],
        giveUp: ['An aging veteran on a big contract'],
        salaryChange: -12,
        deltas: { cash: 20, wins: -8, chemistry: -4, clout: -10 },
        pressureDeltas: { cash: 0, wins: 0, chemistry: -2, clout: -6 },
        risk: 'Medium', futureFlex: 'Higher',
        blurb: 'Trade an expensive veteran for youth and draft picks. You drop under the tax line and protect the future — but you get worse right now.',
        outcome: 'You protected your budget and your future, gaining flexibility — but this season got harder and fans wanted action.',
        ownerReaction: 'Ownership is uneasy about giving up on this season, even if the books look healthier.'
      },
      {
        key: 'chemistrySaver',
        partner: 're-sign a fan-favorite glue guy',
        acquire: ['Beloved locker-room leader'],
        giveUp: ['A small slice of cap space'],
        salaryChange: 5,
        deltas: { cash: -6, wins: 8, chemistry: 18, clout: 6 },
        pressureDeltas: { cash: 0, wins: 1, chemistry: 0, clout: 1 },
        risk: 'Low', futureFlex: 'Medium',
        blurb: 'Keep the heart of the locker room. A safe, balanced move that boosts team chemistry and barely touches the tax.',
        outcome: 'The locker room is tight and the vibes are great. A safe, balanced choice with a modest ceiling.',
        ownerReaction: 'Ownership appreciates the stability but wonders if it is enough to truly contend.'
      },
      {
        key: 'standPat',
        partner: 'make no trade',
        acquire: ['No new players'],
        giveUp: ['Nothing'],
        salaryChange: 0,
        deltas: { cash: 8, wins: 0, chemistry: 4, clout: -6 },
        pressureDeltas: { cash: 0, wins: 0, chemistry: -2, clout: -10 },
        risk: 'Low', futureFlex: 'Higher',
        blurb: 'Trust your current roster. You stay under the tax line and keep every option open for later — but fans may be disappointed.',
        outcome: 'You kept your money and your flexibility, betting on the players you already have.',
        ownerReaction: 'Ownership is frustrated that you stood still while the window is open.'
      }
    ]
  },

  /* -------------------- CLEVELAND CAVALIERS -------------------- */
  {
    id: 'cavaliers',
    name: 'Cleveland Cavaliers',
    emoji: '🏆',
    colors: { primary: '#860038', secondary: '#fdbb30' },
    tag: 'Second Apron Squeeze',
    difficulty: 'Hard',
    situation: 'You are already deep past the second apron and paying repeater tax. Every dollar you add is multiplied into a brutal penalty. Money is the whole story here.',
    needs: ['Find tax savings', 'Keep the core together', 'Avoid panic'],
    basePayroll: 198,        // deep over the second apron
    isRepeater: true,
    baseline: { cash: 30, wins: 64, chemistry: 55, clout: 62 },
    pressure: {
      title: 'The owner is furious about the tax bill',
      body: 'Your owner just saw the luxury tax invoice and is stunned. "I am not paying double for the same team. Find me savings." Cutting the bill now matters more than ever.',
      note: 'Money-saving moves now matter more to ownership than flashy ones.'
    },
    offers: [
      {
        key: 'starSwing',
        partner: 'Trade with the Washington Wizards',
        acquire: ['Another high-paid star'],
        giveUp: ['A young starter', 'A future 1st-round pick'],
        salaryChange: 18,
        deltas: { cash: -22, wins: 20, chemistry: -12, clout: 22 },
        pressureDeltas: { cash: -8, wins: 2, chemistry: -2, clout: 2 },
        risk: 'High', futureFlex: 'Lower',
        blurb: 'Double down by adding another star. As a repeater deep in the tax, this salary is multiplied into a giant bill — but you would be loaded.',
        outcome: 'You went all-in on a super-team. The talent is scary — but the repeater tax bill is one of the largest in the league.',
        ownerReaction: 'Ownership is alarmed by the record-setting tax bill, even if the roster looks unstoppable.'
      },
      {
        key: 'depthUpgrade',
        partner: 'Trade with the Portland Trail Blazers',
        acquire: ['Solid rotation forward'],
        giveUp: ['A bench player', 'A second-round pick'],
        salaryChange: 6,
        deltas: { cash: -10, wins: 12, chemistry: 6, clout: 6 },
        pressureDeltas: { cash: -4, wins: 2, chemistry: 0, clout: 1 },
        risk: 'Medium', futureFlex: 'Lower',
        blurb: 'A clean rotation upgrade. It still raises an already-painful tax bill, but it makes the team better with low drama.',
        outcome: 'A sensible upgrade that helped on the court — but it still added to an already heavy repeater tax bill.',
        ownerReaction: 'Ownership likes the on-court help but is nervous the bill keeps climbing.'
      },
      {
        key: 'futureAsset',
        partner: 'Trade with the Brooklyn Nets',
        acquire: ['A young player', 'A future 1st-round pick'],
        giveUp: ['A veteran on a huge contract'],
        salaryChange: -26,
        deltas: { cash: 34, wins: -10, chemistry: -6, clout: -8 },
        pressureDeltas: { cash: 6, wins: 0, chemistry: 0, clout: -2 },
        risk: 'Medium', futureFlex: 'Higher',
        blurb: 'Trade a giant contract away. You slash the tax bill dramatically and escape the worst penalties — but you get clearly worse this season.',
        outcome: 'You escaped the harshest penalties and gave the team room to breathe — at the cost of being weaker right now.',
        ownerReaction: 'Ownership is relieved to see the tax bill shrink and calls it a responsible reset.'
      },
      {
        key: 'chemistrySaver',
        partner: 're-sign a trusted veteran',
        acquire: ['Respected locker-room veteran'],
        giveUp: ['A small slice of cap space'],
        salaryChange: 3,
        deltas: { cash: -6, wins: 6, chemistry: 16, clout: 4 },
        pressureDeltas: { cash: -2, wins: 1, chemistry: 0, clout: 1 },
        risk: 'Low', futureFlex: 'Lower',
        blurb: 'Keep the leader who holds the room together. Chemistry jumps, and the tax hit is small — but it does add to the bill.',
        outcome: 'The locker room stayed strong and steady, with only a small bump to the tax bill.',
        ownerReaction: 'Ownership values the stability but still wishes the overall bill were smaller.'
      },
      {
        key: 'standPat',
        partner: 'make no trade',
        acquire: ['No new players'],
        giveUp: ['Nothing'],
        salaryChange: 0,
        deltas: { cash: 6, wins: 0, chemistry: 2, clout: -4 },
        pressureDeltas: { cash: 4, wins: 0, chemistry: 0, clout: -4 },
        risk: 'Low', futureFlex: 'Medium',
        blurb: 'Hold the line and add nothing new. You do not grow the tax bill any further, but you also do nothing to fix it.',
        outcome: 'You avoided adding to the bill, but the expensive roster — and its huge tax — stayed exactly the same.',
        ownerReaction: 'Ownership is frustrated that the massive bill was left untouched.'
      }
    ]
  },

  /* -------------------- SAN ANTONIO SPURS -------------------- */
  {
    id: 'spurs',
    name: 'San Antonio Spurs',
    emoji: '👽',
    colors: { primary: '#c4ced4', secondary: '#111111' },
    tag: 'Young & Rising',
    difficulty: 'Friendly',
    situation: 'Your young roster is cheap and full of promise. You are far under the tax line, so you have rare freedom — you can even add a big salary and STILL stay out of the tax.',
    needs: ['Add proven talent', 'Speed up the rebuild', 'Use your cap room wisely'],
    basePayroll: 142,        // far UNDER the tax line
    isRepeater: false,
    baseline: { cash: 80, wins: 42, chemistry: 70, clout: 55 },
    pressure: {
      title: 'Your young star says the team is ready',
      body: 'Your rising superstar tells reporters: "We are ready to win NOW. Let\'s go get someone." Fans are fired up and want you to use your cap room to make a real move.',
      note: 'Win-now and exciting moves now matter more to your locker room and fans.'
    },
    offers: [
      {
        key: 'starSwing',
        partner: 'Trade with the Atlanta Hawks',
        acquire: ['Proven All-Star'],
        giveUp: ['A young prospect', 'A future 1st-round pick'],
        salaryChange: 28,
        deltas: { cash: -24, wins: 28, chemistry: -10, clout: 30 },
        pressureDeltas: { cash: -1, wins: 4, chemistry: 2, clout: 6 },
        risk: 'High', futureFlex: 'Lower',
        blurb: 'Add a real star next to your young core. Because you started so far under the line, even this huge salary keeps you right around the tax line — not over it.',
        outcome: 'You fast-tracked the rebuild with a star, and thanks to your low payroll you stayed near the tax line instead of blowing past it.',
        ownerReaction: 'Ownership is thrilled you used your cap room to swing big at the right moment.'
      },
      {
        key: 'depthUpgrade',
        partner: 'Trade with the Memphis Grizzlies',
        acquire: ['Veteran two-way starter'],
        giveUp: ['A bench player', 'A second-round pick'],
        salaryChange: 10,
        deltas: { cash: -10, wins: 16, chemistry: 8, clout: 10 },
        pressureDeltas: { cash: -1, wins: 2, chemistry: 1, clout: 2 },
        risk: 'Low', futureFlex: 'Medium',
        blurb: 'Add a steady veteran to guide the kids. A clean, balanced upgrade that keeps you comfortably under the tax line.',
        outcome: 'A balanced move that made the young team better and more stable, with money to spare.',
        ownerReaction: 'Ownership approves of the patient, balanced approach.'
      },
      {
        key: 'futureAsset',
        partner: 'Trade with the Houston Rockets',
        acquire: ['Another young prospect', 'Two future 1st-round picks'],
        giveUp: ['A veteran role player'],
        salaryChange: -4,
        deltas: { cash: 10, wins: -4, chemistry: 2, clout: -6 },
        pressureDeltas: { cash: 0, wins: 0, chemistry: -1, clout: -6 },
        risk: 'Medium', futureFlex: 'Higher',
        blurb: 'Stockpile even more picks and youth. You stay loaded with cap room and future options — but you do not get better this season.',
        outcome: 'You loaded up on future assets and stayed flush with cap room, betting big on the years ahead.',
        ownerReaction: 'Ownership is patient but some fans wanted to see a win-now move.'
      },
      {
        key: 'chemistrySaver',
        partner: 'sign a respected mentor',
        acquire: ['Veteran mentor and leader'],
        giveUp: ['A slice of cap space'],
        salaryChange: 6,
        deltas: { cash: -6, wins: 10, chemistry: 16, clout: 8 },
        pressureDeltas: { cash: 0, wins: 1, chemistry: 1, clout: 1 },
        risk: 'Low', futureFlex: 'Medium',
        blurb: 'Bring in a respected mentor for the young core. Chemistry and culture climb, and you stay well under the tax line.',
        outcome: 'The young locker room grew up fast around a great mentor, all while staying cheap.',
        ownerReaction: 'Ownership loves the culture-first investment in the young players.'
      },
      {
        key: 'standPat',
        partner: 'make no trade',
        acquire: ['No new players'],
        giveUp: ['Nothing'],
        salaryChange: 0,
        deltas: { cash: 6, wins: 2, chemistry: 6, clout: -4 },
        pressureDeltas: { cash: 0, wins: 0, chemistry: -2, clout: -8 },
        risk: 'Low', futureFlex: 'Higher',
        blurb: 'Let the young players keep growing together. You keep all your cap room and flexibility for a bigger move later.',
        outcome: 'You let your young core keep developing and kept maximum flexibility for the future.',
        ownerReaction: 'Ownership trusts the long game, though excited fans wanted action now.'
      }
    ]
  }
];

/* Plain-language help shown in the dashboard. */
const GLOSSARY = [
  { term: 'Luxury Tax', def: 'A penalty teams pay when they spend more than the tax line. The more you go over, the bigger the penalty gets.' },
  { term: 'Tax Line', def: 'The spending limit. Spend past it and the luxury tax kicks in.' },
  { term: 'Repeater Tax', def: 'An even harsher penalty for teams that pay the tax many years in a row.' },
  { term: 'Future Flexibility', def: 'Keeping options — like draft picks and cap room — open for later.' }
];

/* UMD-style export so the same file works in the browser and in Node tests. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SIM_META, TAX, METRICS, STRATEGY_TYPES, TEAMS, GLOSSARY };
}
