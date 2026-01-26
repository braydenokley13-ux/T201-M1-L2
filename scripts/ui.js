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
            teamSelectionScreen: document.getElementById('team-selection-screen'),
            gameScreen: document.getElementById('game-screen'),
            resultsScreen: document.getElementById('results-screen'),
            backBtn: document.getElementById('back-btn'),
            simulateBtn: document.getElementById('simulate-btn'),
            tryAgainBtn: document.getElementById('try-again-btn'),
            tryAnotherBtn: document.getElementById('try-another-btn'),
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
            efficiencyScore: document.getElementById('efficiency-score'),
            claimCodeSection: document.getElementById('claim-code-section'),
            claimCode: document.getElementById('claim-code'),
            noClaimCodeSection: document.getElementById('no-claim-code-section'),
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

    renderRoster(team) {
        this.elements.rosterList.innerHTML = '';
        team.roster.forEach((player) => {
            const chip = document.createElement('div');
            chip.className = 'roster-player';
            chip.textContent = player;
            this.elements.rosterList.appendChild(chip);
        });
    },

    renderMoves(moves, selectedMoves, maxReached) {
        this.elements.movesContainer.innerHTML = '';

        moves.forEach((move) => {
            const card = document.createElement('div');
            const isSelected = selectedMoves.some((selected) => selected.id === move.id);
            card.className = `move-card${isSelected ? ' selected' : ''}${!isSelected && maxReached ? ' disabled' : ''}`;
            card.dataset.moveId = move.id;

            const header = document.createElement('div');
            header.className = 'move-header';

            const title = document.createElement('div');
            title.className = 'move-title';
            title.textContent = move.title;

            const label = document.createElement('div');
            label.className = 'move-category-label';
            label.textContent = move.category.replace('-', ' ').toUpperCase();

            header.appendChild(title);
            header.appendChild(label);

            const details = document.createElement('div');
            details.className = 'move-details';
            details.textContent = move.description;

            const tradeInfo = document.createElement('div');
            if (move.trade) {
                tradeInfo.className = 'move-trade-info';
                tradeInfo.innerHTML = `<div class="give">Give: ${move.trade.give}</div><div class="get">Get: ${move.trade.get}</div>`;
            }

            const impact = document.createElement('div');
            impact.className = 'move-impact';
            impact.appendChild(this.createImpactItem('Payroll', move.impact.payroll, '💰'));
            impact.appendChild(this.createImpactItem('Wins', move.impact.wins, '🏆'));
            impact.appendChild(this.createImpactItem('Playoff', move.impact.playoffWins, '🏀'));
            impact.appendChild(this.createImpactItem('Perf', move.impact.perfPoints, '📈'));

            const scout = document.createElement('div');
            scout.className = 'move-scout';
            scout.textContent = move.scout;

            const selectBtn = document.createElement('button');
            selectBtn.className = 'select-btn';
            selectBtn.type = 'button';
            selectBtn.textContent = isSelected ? 'SELECTED' : 'SELECT MOVE';

            card.appendChild(header);
            if (move.trade) {
                card.appendChild(tradeInfo);
            }
            card.appendChild(details);
            card.appendChild(impact);
            if (move.warning) {
                const warning = document.createElement('div');
                warning.className = 'move-warning';
                warning.textContent = move.warning;
                card.appendChild(warning);
            }
            card.appendChild(scout);
            card.appendChild(selectBtn);

            this.elements.movesContainer.appendChild(card);
        });
    },

    createImpactItem(label, value, emoji) {
        const item = document.createElement('div');
        const status = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
        item.className = `impact-item ${status}`;
        const sign = value > 0 ? '+' : '';
        item.textContent = `${emoji} ${label}: ${sign}${value}`;
        return item;
    },

    updateStats(summary, team) {
        const payrollPercent = Math.min((summary.payroll / team.targets.maxSpend) * 100, 100);
        const winsPercent = Math.min((summary.wins / team.targets.wins) * 100, 100);
        const playoffPercent = Math.min((summary.playoffWins / 16) * 100, 100);
        const perfPercent = Math.min((summary.perfPoints / team.targets.perfPoints) * 100, 100);

        this.elements.payrollBar.style.width = `${payrollPercent}%`;
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
    },

    renderResults(results, team) {
        this.elements.resultsHeadline.textContent = results.success ? team.headlines.success : team.headlines.failure;
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

        if (results.success) {
            this.elements.claimCodeSection.style.display = 'block';
            this.elements.noClaimCodeSection.style.display = 'none';
            this.elements.claimCode.textContent = team.claimCode;
        } else {
            this.elements.claimCodeSection.style.display = 'none';
            this.elements.noClaimCodeSection.style.display = 'block';
        }

        if (results.success) {
            this.launchConfetti();
        } else {
            this.clearConfetti();
        }
    },

    launchConfetti() {
        const canvas = this.elements.confettiCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: 6 + Math.random() * 6,
            speed: 2 + Math.random() * 3,
            color: Math.random() > 0.5 ? 'rgba(29, 66, 138, 0.9)' : 'rgba(200, 16, 46, 0.9)'
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
