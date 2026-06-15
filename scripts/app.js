/* =============================================================
   Trade Deadline War Room — App controller (DOM wiring)
   -------------------------------------------------------------
   Holds UI state, renders screens, and wires events. All number
   crunching lives in engine.js. Built to never crash on weird
   student input (rapid clicks, no selection, blank memo, etc.).
   ============================================================= */
(function () {
  'use strict';

  /* --- tiny DOM helpers ------------------------------------ */
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  /* --- app state ------------------------------------------- */
  const state = {
    screen: 'briefing',
    gmName: '',
    teamId: null,
    team: null,
    selectedOfferKey: null,
    pressureActive: false,
    pressureSeen: false,
    report: null
  };

  /* Guard against missing data so the page degrades gracefully. */
  const TEAMS_DATA = (typeof TEAMS !== 'undefined' && Array.isArray(TEAMS)) ? TEAMS : [];
  const METRICS_DATA = (typeof METRICS !== 'undefined' && Array.isArray(METRICS)) ? METRICS : [];

  /* ============================================================
     SCREEN ROUTING
  ============================================================= */
  function showScreen(name) {
    state.screen = name;
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    const target = $('screen-' + name);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    persist();
  }

  function persist() {
    Storage.save({
      gmName: state.gmName,
      teamId: state.teamId,
      selectedOfferKey: state.selectedOfferKey,
      pressureActive: state.pressureActive,
      pressureSeen: state.pressureSeen,
      screen: state.screen
    });
  }

  /* ============================================================
     SETUP SCREEN — team picker
  ============================================================= */
  function renderTeamGrid() {
    const grid = $('team-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!TEAMS_DATA.length) {
      grid.appendChild(el('p', 'empty-state', 'No teams available right now. Please refresh.'));
      return;
    }
    TEAMS_DATA.forEach((team) => {
      const card = el('button', 'team-card');
      card.type = 'button';
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', 'false');
      card.dataset.team = team.id;
      card.innerHTML = `
        <span class="team-card-emoji">${esc(team.emoji || '🏀')}</span>
        <span class="team-card-name">${esc(team.name)}</span>
        <span class="team-card-tag">${esc(team.tag || '')}</span>
        <span class="team-card-diff diff-${esc((team.difficulty || '').toLowerCase())}">${esc(team.difficulty || '')}</span>
        <span class="team-card-sit">${esc(team.situation || '')}</span>
      `;
      card.addEventListener('click', () => selectTeam(team.id));
      grid.appendChild(card);
    });
  }

  function selectTeam(teamId) {
    state.teamId = teamId;
    state.team = TEAMS_DATA.find((t) => t.id === teamId) || null;
    document.querySelectorAll('#team-grid .team-card').forEach((c) => {
      const on = c.dataset.team === teamId;
      c.classList.toggle('selected', on);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    const enterBtn = $('enter-warroom-btn');
    if (enterBtn) enterBtn.disabled = !state.team;
    persist();
  }

  /* ============================================================
     WAR ROOM — dashboard + trade board
  ============================================================= */
  function enterWarRoom() {
    if (!state.team) return;
    // fresh deadline each entry
    state.selectedOfferKey = null;
    state.pressureActive = false;
    state.pressureSeen = false;

    const t = state.team;
    document.body.setAttribute('data-team', t.id);

    setText('warroom-team-emoji', t.emoji || '🏀');
    setText('warroom-title', t.name || 'Team');
    setText('warroom-team-tag', t.tag || 'Front Office Dashboard');
    setText('team-situation', t.situation || '');

    // needs
    const needs = $('team-needs');
    if (needs) {
      needs.innerHTML = '';
      (t.needs || []).forEach((n) => needs.appendChild(el('li', null, esc(n))));
    }

    const banner = $('pressure-banner');
    if (banner) banner.hidden = true;

    const submit = $('submit-strategy-btn');
    if (submit) submit.disabled = true;

    renderTradeBoard();
    renderMeters(t.baseline, null);
    updateSelectedSummary();
    showScreen('warroom');
  }

  function renderTradeBoard() {
    const board = $('trade-board');
    if (!board) return;
    board.innerHTML = '';
    const offers = (state.team && state.team.offers) || [];
    if (!offers.length) {
      board.appendChild(el('p', 'empty-state', 'No trade offers are on the table. Try another team.'));
      const submit = $('submit-strategy-btn');
      if (submit) submit.disabled = true;
      return;
    }
    offers.forEach((offer) => {
      board.appendChild(buildOfferCard(offer));
    });
  }

  function buildOfferCard(offer) {
    const meta = Engine.classifyStrategy(offer);
    const card = el('button', 'offer-card');
    card.type = 'button';
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', 'false');
    card.dataset.offer = offer.key;

    const acquire = (offer.acquire || []).map(esc).join(', ') || '—';
    const giveUp = (offer.giveUp || []).map(esc).join(', ') || '—';
    const salary = Number(offer.salaryChange) || 0;
    const salaryStr = salary === 0 ? 'No salary change' : (salary > 0 ? `+${salary}M salary` : `${salary}M salary`);

    card.innerHTML = `
      <div class="offer-top">
        <span class="offer-identity">${esc(meta.identity)}</span>
        <span class="offer-salary ${salary > 0 ? 'up' : salary < 0 ? 'down' : ''}">${esc(salaryStr)}</span>
      </div>
      <p class="offer-partner">${esc(capitalize(offer.partner || ''))}</p>
      <p class="offer-blurb">${esc(offer.blurb || '')}</p>
      <div class="offer-exchange">
        <div class="ox in"><span class="ox-label">You get</span><span class="ox-text">${acquire}</span></div>
        <div class="ox out"><span class="ox-label">You give</span><span class="ox-text">${giveUp}</span></div>
      </div>
      <div class="offer-badges">
        <span class="mini-badge risk-${esc((offer.risk || '').toLowerCase())}">Risk: ${esc(offer.risk || '—')}</span>
        <span class="mini-badge flex">Future: ${esc(offer.futureFlex || '—')}</span>
      </div>
      <span class="offer-check">✓ Selected</span>
    `;
    card.addEventListener('click', () => selectOffer(offer.key));
    return card;
  }

  function selectOffer(offerKey) {
    const offers = (state.team && state.team.offers) || [];
    const offer = offers.find((o) => o.key === offerKey);
    if (!offer) return;

    state.selectedOfferKey = offerKey;
    document.querySelectorAll('#trade-board .offer-card').forEach((c) => {
      const on = c.dataset.offer === offerKey;
      c.classList.toggle('selected', on);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });

    const projected = Engine.applyOffer(state.team.baseline, offer, state.pressureActive);
    renderMeters(projected, offer);
    updateSelectedSummary();

    const submit = $('submit-strategy-btn');
    if (submit) submit.disabled = false;

    persist();

    // Trigger the pressure moment once, after the first real selection.
    if (!state.pressureSeen && state.team.pressure) {
      triggerPressure();
    }
  }

  function updateSelectedSummary() {
    const box = $('selected-summary');
    if (!box) return;
    const offers = (state.team && state.team.offers) || [];
    const offer = offers.find((o) => o.key === state.selectedOfferKey);
    if (!offer) {
      box.innerHTML = '<span class="ss-empty">No trade selected yet.</span>';
      return;
    }
    const meta = Engine.classifyStrategy(offer);
    box.innerHTML = `<span class="ss-label">Selected:</span> <strong>${esc(meta.identity)}</strong> — ${esc(capitalize(offer.partner || ''))}`;
  }

  /* ----- meters + live luxury tax -------------------------- */
  function renderMeters(metrics, offer) {
    const wrap = $('meters');
    if (!wrap) return;
    const safe = metrics || {};
    const baseline = (state.team && state.team.baseline) || {};
    wrap.innerHTML = '';

    METRICS_DATA.forEach(({ key, label, icon, help }) => {
      const value = Engine.clamp(Number(safe[key]));
      const base = Engine.clamp(Number(baseline[key]));
      let delta = 0;
      if (offer) delta = value - base;

      const row = el('div', 'meter');
      const deltaChip = offer && delta !== 0
        ? `<span class="meter-delta ${delta > 0 ? 'pos' : 'neg'}">${delta > 0 ? '+' : ''}${delta}</span>`
        : '';
      row.innerHTML = `
        <div class="meter-head">
          <span class="meter-label" title="${esc(help)}">${icon} ${esc(label)}</span>
          <span class="meter-value">${value}${deltaChip}</span>
        </div>
        <div class="meter-track">
          <div class="meter-fill fill-${key}" style="width:${value}%"></div>
        </div>
      `;
      wrap.appendChild(row);
    });

    // Hint text
    const hint = $('meters-hint');
    if (hint) hint.textContent = offer
      ? 'Projected team after this trade. Numbers go up and down — there is no perfect score.'
      : 'Pick a trade to see your projected team.';

    renderTax(offer);
  }

  function renderTax(offer) {
    const t = state.team;
    if (!t) return;
    const payroll = offer ? Engine.payrollAfter(t, offer) : (Number(t.basePayroll) || 0);
    const info = Engine.computeLuxuryTax(payroll, t.isRepeater);

    setText('tax-bill', Engine.formatMoney(info.bill));
    setText('tax-payroll', Engine.formatMoney(payroll));
    setText('tax-line', Engine.formatMoney(TAX.taxLine));

    const statusEl = $('tax-status');
    const callout = $('tax-callout');
    if (statusEl) {
      let msg = 'Under the tax line — no penalty';
      let cls = 'tax-callout under';
      if (info.apron === 'second') { msg = 'Past the SECOND APRON — severe penalty'; cls = 'tax-callout danger'; }
      else if (info.apron === 'first') { msg = 'Past the first apron — heavy penalty'; cls = 'tax-callout high'; }
      else if (info.apron === 'tax') { msg = 'Over the tax line — penalty applies'; cls = 'tax-callout over'; }
      if (t.isRepeater && info.bill > 0) msg += ' · REPEATER';
      statusEl.textContent = msg;
      if (callout) callout.className = cls;
    }
  }

  /* ----- pressure moment ----------------------------------- */
  function triggerPressure() {
    const p = state.team && state.team.pressure;
    if (!p) return;
    state.pressureSeen = true;
    state.pressureActive = true;

    setText('modal-title', p.title || 'Pressure Moment');
    setText('modal-body', p.body || '');
    setText('modal-note', p.note ? ('👉 ' + p.note) : '');
    openModal();
    persist();
  }

  function applyPressureAndRefresh() {
    // Banner stays visible as a reminder
    const banner = $('pressure-banner');
    const p = state.team && state.team.pressure;
    if (banner && p) {
      setText('pressure-banner-title', p.title || 'Pressure Moment');
      setText('pressure-banner-note', p.note || '');
      banner.hidden = false;
    }
    // Re-render board + meters with pressure now active
    const offers = (state.team && state.team.offers) || [];
    const offer = offers.find((o) => o.key === state.selectedOfferKey);
    if (offer) {
      const projected = Engine.applyOffer(state.team.baseline, offer, true);
      renderMeters(projected, offer);
    }
  }

  function openModal() {
    const m = $('pressure-modal');
    if (m) { m.hidden = false; document.body.classList.add('modal-open'); }
  }
  function closeModal() {
    const m = $('pressure-modal');
    if (m) { m.hidden = true; document.body.classList.remove('modal-open'); }
  }

  /* ============================================================
     SUBMIT → PERFORMANCE REPORT
  ============================================================= */
  function submitStrategy() {
    const offers = (state.team && state.team.offers) || [];
    const offer = offers.find((o) => o.key === state.selectedOfferKey);
    if (!offer) {
      // Nudge instead of crashing on empty selection
      flashHint('Pick a trade from the board first!');
      return;
    }
    const finalMetrics = Engine.applyOffer(state.team.baseline, offer, state.pressureActive);
    state.report = Engine.buildReport(state.team, offer, finalMetrics, state.pressureActive, '');
    renderReport(state.report);
    showScreen('report');
  }

  function renderReport(report) {
    if (!report) return;

    setText('report-strategy-chip', report.selectedStrategy || 'Strategy');
    setText('report-type', report.strategyType || '—');
    setText('report-tax', Engine.formatMoney(report.luxuryTaxBill));
    setText('report-explanation', report.explanation || '');
    setText('report-owner', report.ownerReaction || '');

    if (report.strongest) setText('report-strongest', `${report.strongest.label} (${report.strongest.value})`);
    if (report.weakest) setText('report-weakest', `${report.weakest.label} (${report.weakest.value})`);

    // report meters
    const wrap = $('report-meters');
    if (wrap) {
      wrap.innerHTML = '';
      METRICS_DATA.forEach(({ key, label, icon }) => {
        const value = Engine.clamp(Number(report.metrics && report.metrics[key]));
        const row = el('div', 'meter');
        row.innerHTML = `
          <div class="meter-head">
            <span class="meter-label">${icon} ${esc(label)}</span>
            <span class="meter-value">${value}</span>
          </div>
          <div class="meter-track"><div class="meter-fill fill-${key}" style="width:${value}%"></div></div>
        `;
        wrap.appendChild(row);
      });
    }

    // reset memo UI
    const memoInput = $('memo-input');
    if (memoInput) memoInput.value = '';
    updateMemoCount();
    const saved = $('memo-saved');
    if (saved) saved.hidden = true;

    // title personalization
    const title = $('report-title');
    if (title) {
      title.textContent = state.gmName
        ? `GM ${state.gmName}'s Deadline Strategy`
        : 'Your Deadline Strategy';
    }
  }

  /* ----- boardroom memo ------------------------------------ */
  function updateMemoCount() {
    const input = $('memo-input');
    const count = $('memo-count');
    if (!input || !count) return;
    count.textContent = `${input.value.length} / 400`;
  }

  function saveMemo() {
    const input = $('memo-input');
    const memo = input ? input.value : '';
    if (state.report) {
      state.report.boardroomMemo = (memo && memo.trim()) ? memo.trim() : 'No memo submitted yet.';
    }
    const savedBox = $('memo-saved');
    const savedText = $('memo-saved-text');
    if (savedBox && savedText) {
      savedText.textContent = state.report ? state.report.boardroomMemo : 'No memo submitted yet.';
      savedBox.hidden = false;
    }
  }

  /* ============================================================
     RESTART
  ============================================================= */
  function playAgain() {
    // same team, fresh deadline
    state.report = null;
    enterWarRoom();
  }
  function newMission() {
    state.report = null;
    state.selectedOfferKey = null;
    showScreen('briefing');
  }

  /* ============================================================
     small utilities
  ============================================================= */
  function setText(id, text) { const n = $(id); if (n) n.textContent = text; }
  function capitalize(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }

  let hintTimer = null;
  function flashHint(msg) {
    const box = $('selected-summary');
    if (!box) return;
    box.innerHTML = `<span class="ss-warn">⚠ ${esc(msg)}</span>`;
    clearTimeout(hintTimer);
    hintTimer = setTimeout(updateSelectedSummary, 2200);
  }

  /* ============================================================
     EVENT WIRING
  ============================================================= */
  function wire() {
    on('briefing-start-btn', 'click', () => showScreen('setup'));
    on('enter-warroom-btn', 'click', enterWarRoom);
    on('submit-strategy-btn', 'click', submitStrategy);
    on('pressure-review-btn', 'click', openModal);
    on('modal-continue-btn', 'click', () => { closeModal(); applyPressureAndRefresh(); });
    on('play-again-btn', 'click', playAgain);
    on('new-mission-btn', 'click', newMission);
    on('memo-save-btn', 'click', saveMemo);

    const memoInput = $('memo-input');
    if (memoInput) memoInput.addEventListener('input', updateMemoCount);

    const gmName = $('gm-name');
    if (gmName) gmName.addEventListener('input', (e) => {
      state.gmName = (e.target.value || '').slice(0, 28);
      persist();
    });

    // back links
    document.querySelectorAll('[data-goto]').forEach((b) => {
      b.addEventListener('click', () => showScreen(b.dataset.goto));
    });

    // modal: close on overlay click / Escape (counts as acknowledging)
    const overlay = $('pressure-modal');
    if (overlay) overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { closeModal(); applyPressureAndRefresh(); }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay && !overlay.hidden) { closeModal(); applyPressureAndRefresh(); }
    });
  }
  function on(id, evt, fn) { const n = $(id); if (n) n.addEventListener(evt, fn); }

  /* ============================================================
     BOOT
  ============================================================= */
  function boot() {
    // Self-check data; log problems but never block students.
    try {
      const issues = Engine.validateData(TEAMS_DATA, METRICS_DATA);
      if (issues.length) console.warn('[War Room] data check:', issues);
    } catch (e) { /* ignore */ }

    renderTeamGrid();
    wire();

    // Restore light state (GM name + team) so a refresh is friendly.
    const saved = Storage.load();
    if (saved && typeof saved === 'object') {
      if (saved.gmName) {
        state.gmName = saved.gmName;
        const gmName = $('gm-name');
        if (gmName) gmName.value = saved.gmName;
      }
      if (saved.teamId && TEAMS_DATA.find((t) => t.id === saved.teamId)) {
        selectTeam(saved.teamId);
      }
    }

    showScreen('briefing');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
