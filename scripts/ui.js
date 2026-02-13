// NBA GM Crisis Manager - UI Updates & Animations
// Handles DOM rendering and visual feedback

const UI = {
    elements: {},

    init() {
        this.cacheElements();
    },

    cacheElements() {
        this.elements = {
            screens: document.querySelectorAll('.screen'),
            homeScreen: document.getElementById('home-screen'),
            teamSelectionScreen: document.getElementById('team-selection-screen'),
            teamIntroScreen: document.getElementById('team-intro-screen'),
            gameScreen: document.getElementById('game-screen'),
            resultsScreen: document.getElementById('results-screen'),
            startBtn: document.getElementById('start-btn'),
            enterGmBtn: document.getElementById('enter-gm-btn'),
            changeTeamBtn: document.getElementById('change-team-btn'),
            backBtn: document.getElementById('back-btn'),
            simulateBtn: document.getElementById('simulate-btn'),
            tryAgainBtn: document.getElementById('try-again-btn'),
            newTeamBtn: document.getElementById('new-team-btn'),
            introTeamEmoji: document.getElementById('intro-team-emoji'),
            introTeamName: document.getElementById('intro-team-name'),
            introTeamScenario: document.getElementById('intro-team-scenario'),
            introTeamDescription: document.getElementById('intro-team-description'),
            introTeamChallenge: document.getElementById('intro-team-challenge'),
            introTargetWins: document.getElementById('intro-target-wins'),
            introTargetPerf: document.getElementById('intro-target-perf'),
            introTargetSpend: document.getElementById('intro-target-spend'),
            currentTeamEmoji: document.getElementById('current-team-emoji'),
            currentTeamName: document.getElementById('current-team-name'),
            scenarioName: document.getElementById('scenario-name'),
            challengeText: document.getElementById('challenge-text'),
            rosterList: document.getElementById('roster-list'),
            movesContainer: document.getElementById('moves-container'),
            selectedCount: document.getElementById('selected-count'),
            selectedMovesList: document.getElementById('selected-moves-list'),
            payrollBar: document.getElementById('payroll-bar'),
            winsBar: document.getElementById('wins-bar'),
            playoffBar: document.getElementById('playoff-bar'),
            perfBar: document.getElementById('perf-bar'),
            currentPayroll: document.getElementById('current-payroll'),
            maxSpend: document.getElementById('max-spend'),
            currentWins: document.getElementById('current-wins'),
            targetWins: document.getElementById('target-wins'),
            currentPlayoffWins: document.getElementById('current-playoff-wins'),
            currentPerf: document.getElementById('current-perf'),
            targetPerf: document.getElementById('target-perf'),
            taxAmount: document.getElementById('tax-amount'),
            repeaterStatus: document.getElementById('repeater-status'),
            resultsHeadline: document.getElementById('results-headline'),
            resultsSource: document.getElementById('results-source'),
            resultWins: document.getElementById('result-wins'),
            resultPayroll: document.getElementById('result-payroll'),
            resultPerf: document.getElementById('result-perf'),
            resultPlayoff: document.getElementById('result-playoff'),
            resultTax: document.getElementById('result-tax'),
            ownerStatement: document.getElementById('owner-statement'),
            statementText: document.getElementById('statement-text'),
            starRating: document.getElementById('star-rating'),
            ratingLabel: document.getElementById('rating-label'),
            movesSummaryList: document.getElementById('moves-summary-list'),
            efficiencyScore: document.getElementById('efficiency-value'),
            claimCodeSection: document.getElementById('claim-code-section'),
            claimCode: document.getElementById('claim-code'),
            noClaimCodeSection: document.getElementById('no-claim-code'),
            confettiCanvas: document.getElementById('confetti-canvas')
        };
    },

    showScreen(screenId) {
        this.elements.screens.forEach((screen) => {
            screen.classList.toggle('active', screen.id === screenId);
        });
        window.scrollTo(0, 0);
    },

    setTeamTheme(teamId) {
        document.body.className = `team-${teamId}`;
    },

    updateTeamHeader(team) {
        this.elements.currentTeamEmoji.textContent = team.emoji;
        this.elements.currentTeamName.textContent = team.name.toUpperCase();
        this.elements.scenarioName.textContent = team.scenario;
        this.elements.challengeText.textContent = `"${team.situation.challenge}"`;
        this.elements.resultsSource.textContent = team.newspaper;
    },

    updateIntro(team) {
        this.elements.introTeamEmoji.textContent = team.emoji;
        this.elements.introTeamName.textContent = team.name.toUpperCase();
        this.elements.introTeamScenario.textContent = team.scenario;
        this.elements.introTeamDescription.textContent = team.situation.description;
        this.elements.introTeamChallenge.textContent = team.situation.challenge;
        this.elements.introTargetWins.textContent = `${team.targets.wins}+`;
        this.elements.introTargetPerf.textContent = `${team.targets.perfPoints}+`;
        this.elements.introTargetSpend.textContent = Calculator.formatCurrency(team.targets.maxSpend);
    },

    renderRoster(team) {
        this.elements.rosterList.innerHTML = '';
        team.roster.forEach((player) => {
            const chip = document.createElement('div');
            chip.className = 'roster-player';
            chip.textContent = player;
            this.elements.rosterList.appendChild(chip);
        });
    },

    renderMoves(moves, selectedMoves, maxReached, team) {
        this.elements.movesContainer.innerHTML = '';
        this.elements.movesContainer.scrollTop = 0;
        const teamContext = (team && team.moveContext) || {};

        moves.forEach((move) => {
            const card = document.createElement('div');
            const isSelected = selectedMoves.some((selected) => selected.id === move.id);
            card.className = `move-card${isSelected ? ' selected' : ''}${!isSelected && maxReached ? ' disabled' : ''}`;
            card.dataset.moveId = move.id;

            const header = document.createElement('div');
            header.className = 'move-header';

            const titleRow = document.createElement('div');
            titleRow.className = 'move-title-row';

            const title = document.createElement('span');
            title.className = 'move-title';
            title.textContent = move.title;

            const indicator = document.createElement('span');
            indicator.className = 'move-select-indicator';
            indicator.textContent = isSelected ? '✓' : '+';

            titleRow.appendChild(title);
            titleRow.appendChild(indicator);

            const impact = document.createElement('div');
            impact.className = 'move-impact';
            impact.appendChild(this.createImpactItem('Payroll', move.impact.payroll, '💰'));
            impact.appendChild(this.createImpactItem('Wins', move.impact.wins, '🏆'));
            if (move.impact.playoffWins !== 0) {
                impact.appendChild(this.createImpactItem('Playoff', move.impact.playoffWins, '🏀'));
            }
            impact.appendChild(this.createImpactItem('Perf', move.impact.perfPoints, '📈'));

            header.appendChild(titleRow);
            header.appendChild(impact);

            if (move.trade) {
                const tradeInfo = document.createElement('div');
                tradeInfo.className = 'move-trade-info';
                tradeInfo.innerHTML = `<span class="give">${move.trade.give}</span> <span class="trade-arrow">&rarr;</span> <span class="get">${move.trade.get}</span>`;
                card.appendChild(header);
                card.appendChild(tradeInfo);
            } else {
                card.appendChild(header);
            }

            const scoutText = teamContext[move.id] || move.scout;
            const scout = document.createElement('div');
            scout.className = 'move-scout';
            if (teamContext[move.id]) {
                scout.classList.add('team-specific');
            }
            if (move.warning) {
                scout.textContent = `⚠️ ${scoutText}`;
                scout.classList.add('has-warning');
            } else {
                scout.textContent = scoutText;
            }

            card.appendChild(scout);

            this.elements.movesContainer.appendChild(card);
        });
    },

    createImpactItem(label, value, emoji) {
        const item = document.createElement('span');
        const status = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
        item.className = `impact-badge ${status}`;
        const sign = value > 0 ? '+' : '';
        const shortLabels = { Payroll: 'M', Wins: 'W', Playoff: 'PO', Perf: 'PP' };
        item.textContent = `${sign}${value}${shortLabels[label] || ''}`;
        item.title = `${label}: ${sign}${value}`;
        return item;
    },

    updateStats(summary, team) {
        const payrollPercent = Math.min((summary.payroll / team.targets.maxSpend) * 100, 100);
        const winsPercent = Math.min((summary.wins / team.targets.wins) * 100, 100);
        const playoffPercent = Math.min((summary.playoffWins / 16) * 100, 100);
        const perfPercent = Math.min((summary.perfPoints / team.targets.perfPoints) * 100, 100);

        const isOverBudget = summary.payroll > team.targets.maxSpend;
        this.elements.payrollBar.style.width = `${payrollPercent}%`;
        this.elements.payrollBar.classList.toggle('over-budget', isOverBudget);
        this.elements.winsBar.style.width = `${winsPercent}%`;
        this.elements.playoffBar.style.width = `${playoffPercent}%`;
        this.elements.perfBar.style.width = `${perfPercent}%`;

        this.elements.currentPayroll.textContent = Calculator.formatCurrency(summary.payroll);
        this.elements.maxSpend.textContent = `${Calculator.formatCurrency(team.targets.maxSpend)} Max`;
        this.elements.currentWins.textContent = summary.wins;
        this.elements.targetWins.textContent = `${team.targets.wins} Target`;
        this.elements.currentPlayoffWins.textContent = summary.playoffWins;
        this.elements.currentPerf.textContent = summary.perfPoints;
        this.elements.targetPerf.textContent = `${team.targets.perfPoints} Target`;
        this.elements.taxAmount.textContent = Calculator.formatCurrency(summary.tax);

        this.elements.payrollBar.closest('.stat-card').classList.toggle('target-hit', !isOverBudget);
        this.elements.winsBar.closest('.stat-card').classList.toggle('target-hit', summary.wins >= team.targets.wins);
        this.elements.perfBar.closest('.stat-card').classList.toggle('target-hit', summary.perfPoints >= team.targets.perfPoints);

        if (team.baseState.isRepeater) {
            this.elements.repeaterStatus.classList.remove('hidden');
        } else {
            this.elements.repeaterStatus.classList.add('hidden');
        }
    },

    updateSelectedMoves(selectedMoves) {
        this.elements.selectedCount.textContent = selectedMoves.length;

        if (selectedMoves.length === 0) {
            this.elements.selectedMovesList.innerHTML = '<p class="no-moves">No moves selected yet</p>';
            return;
        }

        this.elements.selectedMovesList.innerHTML = '';
        selectedMoves.forEach((move) => {
            const item = document.createElement('div');
            item.className = 'selected-move-item';
            item.dataset.moveId = move.id;

            const name = document.createElement('div');
            name.className = 'selected-move-name';
            name.textContent = move.title;

            const impact = document.createElement('div');
            impact.className = 'selected-move-impact';
            impact.textContent = `${move.impact.payroll >= 0 ? '+' : ''}${move.impact.payroll}M payroll, ${move.impact.wins >= 0 ? '+' : ''}${move.impact.wins} wins`;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-move-btn';
            removeBtn.type = 'button';
            removeBtn.textContent = '×';

            item.appendChild(name);
            item.appendChild(impact);
            item.appendChild(removeBtn);

            this.elements.selectedMovesList.appendChild(item);
        });

        if (selectedMoves.length > 0) {
            const totals = selectedMoves.reduce(
                (acc, move) => {
                    acc.payroll += move.impact.payroll;
                    acc.wins += move.impact.wins;
                    acc.perfPoints += move.impact.perfPoints;
                    return acc;
                },
                { payroll: 0, wins: 0, perfPoints: 0 }
            );
            const summary = document.createElement('div');
            summary.className = 'selected-moves-totals';
            const fmtVal = (v) => (v >= 0 ? `+${v}` : `${v}`);
            summary.innerHTML = `<span class="totals-label">Net Impact:</span> <span class="${totals.payroll > 0 ? 'negative' : 'positive'}">${fmtVal(totals.payroll)}M</span> <span class="${totals.wins >= 0 ? 'positive' : 'negative'}">${fmtVal(totals.wins)}W</span> <span class="${totals.perfPoints >= 0 ? 'positive' : 'negative'}">${fmtVal(totals.perfPoints)}PP</span>`;
            this.elements.selectedMovesList.appendChild(summary);
        }
    },

    renderResults(results, team) {
        this.elements.resultsHeadline.textContent = results.success ? team.headlines.success : team.headlines.failure;
        this.elements.resultsHeadline.className = `results-headline ${results.success ? 'success' : 'failure'}`;
        this.elements.statementText.textContent = results.success ? team.statements.success : team.statements.failure;

        this.elements.resultWins.querySelector('.result-value').textContent = `${results.wins}-${82 - results.wins}`;
        this.elements.resultWins.querySelector('.result-status').textContent = results.hitWins ? '✓ HIT TARGET' : '✕ MISSED TARGET';
        this.elements.resultWins.querySelector('.result-status').className = `result-status ${results.hitWins ? 'success' : 'failure'}`;

        this.elements.resultPayroll.querySelector('.result-value').textContent = Calculator.formatCurrency(results.payroll);
        this.elements.resultPayroll.querySelector('.result-status').textContent = results.hitSpend ? '✓ UNDER MAX' : '✕ OVER MAX';
        this.elements.resultPayroll.querySelector('.result-status').className = `result-status ${results.hitSpend ? 'success' : 'failure'}`;

        this.elements.resultPerf.querySelector('.result-value').textContent = `${results.perfPoints} / ${team.targets.perfPoints}`;
        this.elements.resultPerf.querySelector('.result-status').textContent = results.hitPerf ? '✓ HIT TARGET' : '✕ MISSED TARGET';
        this.elements.resultPerf.querySelector('.result-status').className = `result-status ${results.hitPerf ? 'success' : 'failure'}`;

        this.elements.resultPlayoff.querySelector('.result-value').textContent = results.playoffResult;
        this.elements.resultTax.querySelector('.result-value').textContent = Calculator.formatCurrency(results.tax);

        this.elements.movesSummaryList.innerHTML = '';
        if (results.selectedMoves.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'Stayed the course with no major moves.';
            this.elements.movesSummaryList.appendChild(listItem);
        } else {
            results.selectedMoves.forEach((move) => {
                const listItem = document.createElement('li');
                listItem.textContent = move.title;
                this.elements.movesSummaryList.appendChild(listItem);
            });
        }

        this.elements.efficiencyScore.textContent = results.efficiencyScore;

        this.elements.starRating.innerHTML = '';
        for (let i = 0; i < 5; i += 1) {
            const star = document.createElement('span');
            star.className = `result-star${i < results.stars ? '' : ' empty'}`;
            star.textContent = '★';
            this.elements.starRating.appendChild(star);
        }
        this.elements.ratingLabel.textContent = results.success ? 'SUCCESS!' : results.hitCount >= 2 ? 'CLOSE!' : 'FAILURE';
        this.elements.ratingLabel.className = 'rating-label';
        if (results.success) {
            this.elements.ratingLabel.classList.add('success');
        } else if (results.hitCount >= 2) {
            this.elements.ratingLabel.classList.add('close');
        } else {
            this.elements.ratingLabel.classList.add('failure');
        }

        if (results.success) {
            this.elements.claimCodeSection.style.display = 'block';
            this.elements.noClaimCodeSection.style.display = 'none';
            this.elements.claimCode.textContent = team.claimCode;
        } else {
            this.elements.claimCodeSection.style.display = 'none';
            this.elements.noClaimCodeSection.style.display = 'block';
        }

        if (results.success) {
            this.launchConfetti(team.colors);
        } else {
            this.clearConfetti();
        }
    },

    launchConfetti(teamColors) {
        const canvas = this.elements.confettiCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const color1 = teamColors ? teamColors.primary : '#3b82f6';
        const color2 = teamColors ? teamColors.secondary : '#ec4899';

        const pieces = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: 6 + Math.random() * 6,
            speed: 2 + Math.random() * 3,
            color: Math.random() > 0.5 ? color1 : color2
        }));

        let animationFrame;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach((piece) => {
                piece.y += piece.speed;
                if (piece.y > canvas.height) {
                    piece.y = -20;
                }
                ctx.fillStyle = piece.color;
                ctx.fillRect(piece.x, piece.y, piece.size, piece.size);
            });
            animationFrame = requestAnimationFrame(draw);
        };
        draw();

        setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            this.clearConfetti();
        }, 3500);
    },

    clearConfetti() {
        const canvas = this.elements.confettiCanvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UI };
}
