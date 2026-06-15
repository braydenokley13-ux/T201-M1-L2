/* =============================================================
   Trade Deadline War Room — Engine (pure logic, no DOM)
   -------------------------------------------------------------
   Every function here is pure so it can be unit-tested in Node
   (see tests/engine.test.js) and reused in the browser.
   ============================================================= */

/* In Node, pull data in via require; in the browser these are globals. */
let _TAX, _STRATEGY_TYPES, _METRICS;
if (typeof module !== 'undefined' && module.exports) {
  const data = require('./data.js');
  _TAX = data.TAX; _STRATEGY_TYPES = data.STRATEGY_TYPES; _METRICS = data.METRICS;
}

const Engine = {
  /* Keep a number inside a range. Defaults to the 0-100 meter range. */
  clamp(n, min = 0, max = 100) {
    const num = Number(n);
    if (!Number.isFinite(num)) return min;
    return Math.max(min, Math.min(max, num));
  },

  /* Friendly money string, no decimals. */
  formatMoney(millions) {
    const m = Number(millions);
    if (!Number.isFinite(m)) return '$0M';
    return `$${Math.round(m)}M`;
  },

  /* THE LUXURY TAX, FOR REAL.
     Returns the tax bill in $millions for a given payroll. The rate
     climbs the further past the tax line a team spends — that rising
     multiplier is the whole point of the lesson. Repeater teams pay
     an extra +1.0 on every rate. */
  computeLuxuryTax(payroll, isRepeater, tax) {
    const cfg = tax || _TAX || (typeof TAX !== 'undefined' ? TAX : null);
    if (!cfg) return { bill: 0, over: 0, apron: 'under' };

    const pay = Number(payroll);
    if (!Number.isFinite(pay) || pay <= cfg.taxLine) {
      return { bill: 0, over: 0, apron: 'under' };
    }

    const repeaterAdd = isRepeater ? 1.0 : 0;
    let remaining = pay - cfg.taxLine;
    let bill = 0;

    for (const rate of cfg.brackets) {
      if (remaining <= 0) break;
      const taxable = Math.min(5, remaining); // $5M bands
      bill += taxable * (rate + repeaterAdd);
      remaining -= taxable;
    }
    if (remaining > 0) {
      bill += remaining * (cfg.overflowRate + repeaterAdd);
    }

    let apron = 'tax';
    if (pay >= cfg.secondApron) apron = 'second';
    else if (pay >= cfg.firstApron) apron = 'first';

    return { bill: Math.round(bill), over: Math.round(pay - cfg.taxLine), apron };
  },

  /* Final payroll after a trade offer is applied. */
  payrollAfter(team, offer) {
    if (!team || !offer) return team ? Number(team.basePayroll) || 0 : 0;
    return (Number(team.basePayroll) || 0) + (Number(offer.salaryChange) || 0);
  },

  /* Apply an offer's deltas to a team's baseline meters.
     If the pressure moment is active, the offer's pressureDeltas are
     layered on top. Everything is clamped to 0-100. */
  applyOffer(baseline, offer, pressureActive) {
    const metrics = _METRICS || (typeof METRICS !== 'undefined' ? METRICS : []);
    const out = {};
    const safeBase = baseline || {};
    metrics.forEach(({ key }) => {
      let val = Number(safeBase[key]);
      if (!Number.isFinite(val)) val = 50;
      if (offer && offer.deltas && Number.isFinite(Number(offer.deltas[key]))) {
        val += Number(offer.deltas[key]);
      }
      if (pressureActive && offer && offer.pressureDeltas && Number.isFinite(Number(offer.pressureDeltas[key]))) {
        val += Number(offer.pressureDeltas[key]);
      }
      out[key] = Engine.clamp(Math.round(val));
    });
    return out;
  },

  /* Map an offer to its strategy type name for the report. */
  classifyStrategy(offer) {
    const types = _STRATEGY_TYPES || (typeof STRATEGY_TYPES !== 'undefined' ? STRATEGY_TYPES : {});
    if (offer && offer.key && types[offer.key]) {
      return { type: types[offer.key].type, identity: types[offer.key].identity };
    }
    return { type: 'Front Office Decision', identity: 'Strategy' };
  },

  /* Find the highest and lowest meters for the report.
     Ties are broken by the order metrics are defined. */
  strongestWeakest(metrics) {
    const order = _METRICS || (typeof METRICS !== 'undefined' ? METRICS : []);
    let strongest = null, weakest = null;
    order.forEach(({ key, label }) => {
      const v = Number(metrics && metrics[key]);
      if (!Number.isFinite(v)) return;
      if (strongest === null || v > strongest.value) strongest = { key, label, value: v };
      if (weakest === null || v < weakest.value) weakest = { key, label, value: v };
    });
    return { strongest, weakest };
  },

  /* Build the full Performance Report object. Pure + defensive so a
     missing field can never crash the results screen. */
  buildReport(team, offer, finalMetrics, pressureActive, memo) {
    const strat = Engine.classifyStrategy(offer);
    const sw = Engine.strongestWeakest(finalMetrics);
    const payroll = Engine.payrollAfter(team, offer);
    const taxInfo = Engine.computeLuxuryTax(payroll, team && team.isRepeater);

    const cleanMemo = (typeof memo === 'string' && memo.trim().length)
      ? memo.trim()
      : 'No memo submitted yet.';

    let ownerReaction = (offer && offer.ownerReaction) || 'Ownership has reviewed your decision.';
    if (pressureActive && team && team.pressure && team.pressure.note) {
      ownerReaction += ` (Remember: ${team.pressure.note.toLowerCase()})`;
    }

    return {
      // Highway World friendly shape
      simulationId: (typeof SIM_META !== 'undefined' && SIM_META.simulationId) || 'bsc-201-m1-l2',
      track: '201', module: 'Module 1', lesson: 'Lesson 2',
      teamId: team && team.id,
      teamName: team && team.name,
      selectedStrategy: (offer && offer.identity) || strat.identity,
      strategyType: strat.type,
      metrics: finalMetrics,
      payroll,
      luxuryTaxBill: taxInfo.bill,
      apron: taxInfo.apron,
      strongest: sw.strongest,
      weakest: sw.weakest,
      explanation: (offer && offer.outcome) || 'Your front office made its move.',
      ownerReaction,
      pressureFaced: !!pressureActive,
      boardroomMemo: cleanMemo,
      completionResult: 'complete'
    };
  },

  /* Self-check used at load time and in tests to catch authoring
     mistakes (missing fields, broken meters). Returns a list of
     human-readable problems; empty list means data is healthy. */
  validateData(teams, metrics) {
    const issues = [];
    const metricKeys = (metrics || _METRICS || (typeof METRICS !== 'undefined' ? METRICS : [])).map(m => m.key);
    if (!Array.isArray(teams) || teams.length === 0) {
      issues.push('No teams defined.');
      return issues;
    }
    teams.forEach((t, ti) => {
      if (!t.id) issues.push(`Team #${ti} missing id.`);
      if (!t.baseline) issues.push(`Team ${t.id || ti} missing baseline.`);
      if (!Array.isArray(t.offers) || t.offers.length === 0) {
        issues.push(`Team ${t.id || ti} has no offers.`);
        return;
      }
      t.offers.forEach((o, oi) => {
        if (!o.key) issues.push(`Team ${t.id} offer #${oi} missing key.`);
        if (!o.deltas) issues.push(`Team ${t.id} offer ${o.key || oi} missing deltas.`);
        metricKeys.forEach(k => {
          // Every baseline meter should land in range for at least the no-delta case.
          if (t.baseline && !Number.isFinite(Number(t.baseline[k]))) {
            issues.push(`Team ${t.id} baseline.${k} is not a number.`);
          }
        });
      });
    });
    return issues;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Engine };
}
