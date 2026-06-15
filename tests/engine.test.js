/* =============================================================
   Engine tests — run with:  node tests/engine.test.js
   No framework: just Node's built-in assert. Keeps validation
   lightweight and actually runnable in any environment.
   ============================================================= */
const assert = require('assert');
const { Engine } = require('../scripts/engine.js');
const { TEAMS, METRICS, TAX } = require('../scripts/data.js');

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { console.error('  ✗ ' + name + '\n    ' + e.message); process.exitCode = 1; }
}

console.log('\nTrade Deadline War Room — engine tests\n');

/* ---- clamp ---- */
test('clamp keeps values in 0-100', () => {
  assert.strictEqual(Engine.clamp(150), 100);
  assert.strictEqual(Engine.clamp(-20), 0);
  assert.strictEqual(Engine.clamp(55), 55);
});
test('clamp handles bad input safely', () => {
  assert.strictEqual(Engine.clamp('abc'), 0);
  assert.strictEqual(Engine.clamp(undefined), 0);
  assert.strictEqual(Engine.clamp(NaN), 0);
});

/* ---- formatMoney ---- */
test('formatMoney has no decimals and a $ + M', () => {
  assert.strictEqual(Engine.formatMoney(48.4), '$48M');
  assert.strictEqual(Engine.formatMoney('bad'), '$0M');
});

/* ---- luxury tax: the core lesson ---- */
test('no tax under the line', () => {
  const r = Engine.computeLuxuryTax(160, false, TAX);
  assert.strictEqual(r.bill, 0);
  assert.strictEqual(r.apron, 'under');
});
test('tax grows the further you go over (multiplier in action)', () => {
  const small = Engine.computeLuxuryTax(176, false, TAX); // $5M over
  const big = Engine.computeLuxuryTax(196, false, TAX);   // $25M over
  assert.ok(big.bill > small.bill * 4, 'big overage should be punished much harder');
});
test('repeater pays strictly more than non-repeater', () => {
  const normal = Engine.computeLuxuryTax(196, false, TAX);
  const repeat = Engine.computeLuxuryTax(196, true, TAX);
  assert.ok(repeat.bill > normal.bill, 'repeater tax should be higher');
});
test('apron labels are correct', () => {
  assert.strictEqual(Engine.computeLuxuryTax(172, false, TAX).apron, 'tax');
  assert.strictEqual(Engine.computeLuxuryTax(180, false, TAX).apron, 'first');
  assert.strictEqual(Engine.computeLuxuryTax(192, false, TAX).apron, 'second');
});

/* ---- applyOffer ---- */
test('applyOffer adds deltas and clamps', () => {
  const base = { cash: 50, wins: 50, chemistry: 50, clout: 50 };
  const offer = { deltas: { cash: -28, wins: 30, chemistry: -14, clout: 30 } };
  const out = Engine.applyOffer(base, offer, false);
  assert.strictEqual(out.cash, 22);
  assert.strictEqual(out.wins, 80);
});
test('applyOffer layers pressure deltas only when active', () => {
  const base = { cash: 50, wins: 50, chemistry: 50, clout: 50 };
  const offer = { deltas: { wins: 10 }, pressureDeltas: { wins: 5 } };
  assert.strictEqual(Engine.applyOffer(base, offer, false).wins, 60);
  assert.strictEqual(Engine.applyOffer(base, offer, true).wins, 65);
});
test('applyOffer survives missing data', () => {
  const out = Engine.applyOffer(null, null, false);
  METRICS.forEach(m => assert.ok(Number.isFinite(out[m.key])));
});

/* ---- classify + strongest/weakest ---- */
test('classifyStrategy maps known keys', () => {
  assert.strictEqual(Engine.classifyStrategy({ key: 'starSwing' }).type, 'Win-Now Strategist');
  assert.strictEqual(Engine.classifyStrategy({}).type, 'Front Office Decision');
});
test('strongestWeakest finds the extremes', () => {
  const { strongest, weakest } = Engine.strongestWeakest({ cash: 20, wins: 90, chemistry: 50, clout: 40 });
  assert.strictEqual(strongest.key, 'wins');
  assert.strictEqual(weakest.key, 'cash');
});

/* ---- buildReport ---- */
test('buildReport never crashes on blank memo', () => {
  const team = TEAMS[0];
  const offer = team.offers[0];
  const metrics = Engine.applyOffer(team.baseline, offer, false);
  const r = Engine.buildReport(team, offer, metrics, false, '');
  assert.strictEqual(r.boardroomMemo, 'No memo submitted yet.');
  assert.ok(r.strategyType);
  assert.ok(r.completionResult === 'complete');
});
test('buildReport keeps a real memo', () => {
  const team = TEAMS[0];
  const r = Engine.buildReport(team, team.offers[0], team.baseline, true, '  We went for it.  ');
  assert.strictEqual(r.boardroomMemo, 'We went for it.');
  assert.strictEqual(r.pressureFaced, true);
});

/* ---- data integrity ---- */
test('all authored data passes the self-check', () => {
  const issues = Engine.validateData(TEAMS, METRICS);
  assert.deepStrictEqual(issues, [], 'data issues: ' + issues.join('; '));
});
test('every team has all 5 strategy identities and in-range baselines', () => {
  const wanted = ['starSwing', 'depthUpgrade', 'futureAsset', 'chemistrySaver', 'standPat'];
  TEAMS.forEach(t => {
    const keys = t.offers.map(o => o.key);
    wanted.forEach(w => assert.ok(keys.includes(w), `${t.id} missing ${w}`));
    METRICS.forEach(m => {
      const v = t.baseline[m.key];
      assert.ok(v >= 0 && v <= 100, `${t.id}.${m.key} baseline out of range`);
    });
  });
});
test('no offer can push any metric out of 0-100 (balance check)', () => {
  TEAMS.forEach(t => t.offers.forEach(o => {
    [false, true].forEach(pressure => {
      const m = Engine.applyOffer(t.baseline, o, pressure);
      METRICS.forEach(k => assert.ok(m[k.key] >= 0 && m[k.key] <= 100));
    });
  }));
});

console.log(`\n${passed} checks passed.\n`);
