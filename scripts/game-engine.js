// NBA GM Crisis Manager - Core Game Logic
// Controls game state, selections, and simulation

const GameEngine = {
    state: {
        currentTeam: null,
        activeCategory: 'trades',
        selectedMoves: [],
        gameStartTime: null,
        achievements: [], // Loaded from achievements.json
        currentStreak: 0
    },

    init() {
        UI.init();
        this.loadAchievements();
        this.bindEvents();
        this.resetState();
        this.checkForSavedGame();
        UI.showScreen('team-selection-screen');
    },

    // Load achievement definitions from JSON
    async loadAchievements() {
        try {
            const response = await fetch('data/achievements.json');
            this.state.achievements = await response.json();
        } catch (e) {
            console.error('Failed to load achievements:', e);
            this.state.achievements = [];
        }
    },

    // Check if there's a saved game and offer to continue
    checkForSavedGame() {
        if (Storage.hasSavedGame()) {
            const savedGame = Storage.getCurrentGame();
            // Show continue button or modal (UI will handle this)
            if (UI.showContinueOption) {
                UI.showContinueOption(savedGame);
            }
        }
    },

    // Load saved game
    loadSavedGame() {
        const savedGame = Storage.getCurrentGame();
        if (savedGame && savedGame.teamId) {
            // Reconstruct selected moves from IDs
            const moves = savedGame.selectedMoves.map(savedMove =>
                MOVES.find(m => m.id === savedMove.id)
            ).filter(Boolean);

            this.selectTeam(savedGame.teamId, { showIntro: false });
            this.state.selectedMoves = moves;
            this.renderCurrentState();
            UI.showScreen('game-screen');
        }
    },

    bindEvents() {
        // Intro screen buttons - use direct DOM query for reliability
        const enterGmBtn = document.getElementById('enter-gm-btn');
        const changeTeamBtn = document.getElementById('change-team-btn');

        if (enterGmBtn) {
            enterGmBtn.addEventListener('click', () => {
                if (!this.state.currentTeam) {
                    return;
                }
                this.renderCurrentState();
                UI.showScreen('game-screen');
            });
        }

        if (changeTeamBtn) {
            changeTeamBtn.addEventListener('click', () => {
                UI.showScreen('team-selection-screen');
            });
        }

        document.querySelectorAll('.play-btn').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const card = event.target.closest('.team-card');
                if (!card) {
                    return;
                }
                this.selectTeam(card.dataset.team, { showIntro: true });
            });
        });

        document.querySelectorAll('.team-card').forEach((card) => {
            card.addEventListener('click', () => {
                const teamId = card.dataset.team;
                this.selectTeam(teamId, { showIntro: true });
            });
        });

        document.querySelectorAll('.tab-btn').forEach((tab) => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
                tab.classList.add('active');
                this.state.activeCategory = tab.dataset.category;
                this.renderMoves();
            });
        });

        UI.elements.movesContainer.addEventListener('click', (event) => {
            const card = event.target.closest('.move-card');
            if (!card || card.classList.contains('disabled')) {
                return;
            }
            const moveId = card.dataset.moveId;
            this.toggleMove(moveId);
        });

        UI.elements.selectedMovesList.addEventListener('click', (event) => {
            const button = event.target.closest('.remove-move-btn');
            if (!button) {
                return;
            }
            const item = event.target.closest('.selected-move-item');
            if (!item) {
                return;
            }
            this.removeMove(item.dataset.moveId);
        });

        UI.elements.backBtn.addEventListener('click', () => {
            UI.showScreen('team-intro-screen');
        });

        UI.elements.simulateBtn.addEventListener('click', () => {
            if (!this.state.currentTeam) {
                return;
            }
            const results = this.simulateSeason();
            UI.renderResults(results, this.state.currentTeam);
            UI.showScreen('results-screen');
        });

        UI.elements.tryAgainBtn.addEventListener('click', () => {
            if (!this.state.currentTeam) {
                return;
            }
            this.state.selectedMoves = [];
            this.renderCurrentState();
            UI.showScreen('game-screen');
        });

        if (UI.elements.newTeamBtn) {
            UI.elements.newTeamBtn.addEventListener('click', () => {
                this.resetState();
                UI.showScreen('team-selection-screen');
            });
        }

        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (!this.state.currentTeam) {
                    return;
                }
                const summary = this.calculateSummary();
                const team = this.state.currentTeam;
                const text = `NBA GM Crisis Manager\nTeam: ${team.name}\nRecord: ${summary.wins}-${82 - summary.wins}\nPayroll: ${Calculator.formatCurrency(summary.payroll)}\nPerf Points: ${summary.perfPoints}\nMoves: ${this.state.selectedMoves.map(m => m.title).join(', ') || 'None'}`;
                navigator.clipboard.writeText(text).then(() => {
                    shareBtn.textContent = 'Copied!';
                    setTimeout(() => { shareBtn.textContent = 'Share Results'; }, 2000);
                }).catch(() => {
                    shareBtn.textContent = 'Copy failed';
                    setTimeout(() => { shareBtn.textContent = 'Share Results'; }, 2000);
                });
            });
        }
    },

    resetState() {
        this.state.currentTeam = null;
        this.state.activeCategory = 'trades';
        this.state.selectedMoves = [];
        document.querySelectorAll('.tab-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.category === 'trades');
        });
    },

    selectTeam(teamId, options = { showIntro: false }) {
        this.state.currentTeam = TEAMS[teamId];
        this.state.selectedMoves = [];
        this.state.activeCategory = 'trades';
        this.state.gameStartTime = Date.now(); // Track start time for speed run achievement
        document.querySelectorAll('.tab-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.category === 'trades');
        });
        UI.setTeamTheme(teamId);
        UI.updateTeamHeader(this.state.currentTeam);
        UI.updateIntro(this.state.currentTeam);
        UI.renderRoster(this.state.currentTeam);
        if (options.showIntro) {
            UI.showScreen('team-intro-screen');
        } else {
            this.renderCurrentState();
            UI.showScreen('game-screen');
        }
    },

    renderCurrentState() {
        this.renderMoves();
        UI.updateSelectedMoves(this.state.selectedMoves);
        const summary = this.calculateSummary();
        UI.updateStats(summary, this.state.currentTeam);
        UI.elements.simulateBtn.classList.toggle('ready', this.state.selectedMoves.length > 0);
    },

    renderMoves() {
        const filtered = MOVES.filter((move) => move.category === this.state.activeCategory);
        const maxReached = this.state.selectedMoves.length >= 5;
        UI.renderMoves(filtered, this.state.selectedMoves, maxReached, this.state.currentTeam);
        UI.updateSelectedMoves(this.state.selectedMoves);
    },

    toggleMove(moveId) {
        const existing = this.state.selectedMoves.find((move) => move.id === moveId);
        if (existing) {
            this.state.selectedMoves = this.state.selectedMoves.filter((move) => move.id !== moveId);
        } else {
            if (this.state.selectedMoves.length >= 5) {
                return;
            }
            const move = MOVES.find((item) => item.id === moveId);
            if (move) {
                this.state.selectedMoves = [...this.state.selectedMoves, move];
            }
        }
        this.renderCurrentState();
        // Auto-save current game state
        this.saveCurrentGame();
    },

    removeMove(moveId) {
        this.state.selectedMoves = this.state.selectedMoves.filter((move) => move.id !== moveId);
        this.renderCurrentState();
        // Auto-save current game state
        this.saveCurrentGame();
    },

    // Save current game state to localStorage
    saveCurrentGame() {
        if (this.state.currentTeam) {
            Storage.saveCurrentGame(this.state.currentTeam.id, this.state.selectedMoves);
        }
    },

    calculateSummary() {
        const team = this.state.currentTeam;
        const base = team.baseState;
        const totals = this.state.selectedMoves.reduce(
            (acc, move) => {
                acc.payroll += move.impact.payroll;
                acc.wins += move.impact.wins;
                acc.playoffWins += move.impact.playoffWins;
                acc.perfPoints += move.impact.perfPoints;
                return acc;
            },
            { payroll: 0, wins: 0, playoffWins: 0, perfPoints: 0 }
        );

        const payroll = Math.max(0, Math.round(base.payroll + totals.payroll));
        const wins = Math.max(0, Math.min(82, Math.round(base.wins + totals.wins)));
        const playoffWins = Math.max(0, Math.min(16, Math.round(base.playoffWins + totals.playoffWins)));
        const perfPoints = Calculator.calculatePerformancePoints(wins, playoffWins, team.bonuses) + totals.perfPoints;
        const taxInfo = Calculator.calculateLuxuryTax(payroll, base.isRepeater);

        return {
            payroll,
            wins,
            playoffWins,
            perfPoints: Math.max(0, perfPoints),
            tax: taxInfo.tax
        };
    },

    simulateSeason() {
        const team = this.state.currentTeam;
        const summary = this.calculateSummary();
        const hitWins = summary.wins >= team.targets.wins;
        const hitPerf = summary.perfPoints >= team.targets.perfPoints;
        const hitSpend = summary.payroll <= team.targets.maxSpend;
        const hitCount = [hitWins, hitPerf, hitSpend].filter(Boolean).length;
        const success = hitCount === 3;
        const playoffResult = this.formatPlayoffResult(summary.playoffWins);

        const efficiencyScore = Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    50 + hitCount * 15 + Math.max(0, team.targets.maxSpend - summary.payroll) * 0.2 + Math.max(0, summary.wins - team.targets.wins) * 0.5
                )
            )
        );

        const stars = Math.min(
            5,
            hitCount + (summary.playoffWins >= 4 ? 1 : 0) + (summary.payroll <= team.targets.maxSpend - 10 ? 1 : 0)
        );

        const results = {
            wins: summary.wins,
            payroll: summary.payroll,
            perfPoints: summary.perfPoints,
            playoffResult,
            playoffWins: summary.playoffWins,
            tax: summary.tax,
            hitWins,
            hitPerf,
            hitSpend,
            hitCount,
            success,
            efficiencyScore,
            stars,
            selectedMoves: this.state.selectedMoves,
            timeTaken: Date.now() - this.state.gameStartTime,
            budgetMargin: team.targets.maxSpend - summary.payroll,
            moveCount: this.state.selectedMoves.length
        };

        // Update storage
        Storage.updateTeamStats(team.id, results);

        // Detect and unlock achievements
        const unlockedAchievements = this.detectAchievements(results);
        results.unlockedAchievements = unlockedAchievements;

        // Clear saved game since scenario is complete
        Storage.clearCurrentGame();

        // Update streak
        if (success) {
            this.state.currentStreak += 1;
        } else {
            this.state.currentStreak = 0;
        }

        return results;
    },

    // Detect which achievements were earned this game
    detectAchievements(results) {
        const unlockedAchievements = [];

        this.state.achievements.forEach(achievement => {
            // Skip if already unlocked
            if (Storage.hasAchievement(achievement.id)) {
                return;
            }

            let shouldUnlock = false;
            const condition = achievement.condition;

            switch (condition.type) {
                case 'first_completion':
                    shouldUnlock = results.success && Storage.getStats().totalGamesWon === 1;
                    break;

                case 'stars':
                    shouldUnlock = results.stars >= condition.threshold;
                    break;

                case 'tax_free':
                    shouldUnlock = results.success && results.tax === 0;
                    break;

                case 'move_count':
                    shouldUnlock = results.moveCount === condition.value && results.success === condition.success;
                    break;

                case 'move_count_max':
                    shouldUnlock = results.moveCount <= condition.threshold && results.success;
                    break;

                case 'target_margin':
                    const team = this.state.currentTeam;
                    const winsMargin = results.wins - team.targets.wins;
                    const perfMargin = results.perfPoints - team.targets.perfPoints;
                    const budgetMargin = results.budgetMargin; // Already in millions
                    shouldUnlock = results.success && winsMargin >= condition.threshold &&
                                   perfMargin >= condition.threshold && budgetMargin >= condition.threshold;
                    break;

                case 'efficiency':
                    shouldUnlock = results.success && results.efficiencyScore >= condition.threshold;
                    break;

                case 'streak':
                    shouldUnlock = this.state.currentStreak >= condition.threshold;
                    break;

                case 'team_completion':
                    shouldUnlock = results.success && this.state.currentTeam.id === condition.team;
                    break;

                case 'all_teams':
                    const completedTeams = Object.values(Storage.getAllTeamStats())
                        .filter(t => t.completed).length;
                    shouldUnlock = completedTeams >= condition.threshold;
                    break;

                case 'budget_margin':
                    shouldUnlock = results.success && results.budgetMargin >= condition.threshold;
                    break;

                case 'time':
                    shouldUnlock = results.success && results.timeTaken <= condition.threshold;
                    break;

                case 'retry_success':
                    const teamStats = Storage.getTeamStats(this.state.currentTeam.id);
                    shouldUnlock = results.success && teamStats.attempts > 1;
                    break;

                case 'playoff_wins':
                    shouldUnlock = results.success && results.playoffWins >= condition.threshold;
                    break;
            }

            if (shouldUnlock) {
                const wasNew = Storage.unlockAchievement(achievement.id);
                if (wasNew) {
                    unlockedAchievements.push(achievement);
                }
            }
        });

        return unlockedAchievements;
    },

    formatPlayoffResult(playoffWins) {
        if (playoffWins <= 0) {
            return 'Missed Playoffs';
        }
        if (playoffWins === 1) {
            return 'First Round';
        }
        if (playoffWins === 2) {
            return 'Conference Semis';
        }
        if (playoffWins === 3) {
            return 'Conference Finals';
        }
        if (playoffWins === 4) {
            return 'NBA Finals';
        }
        return 'Champions';
    }
};

window.addEventListener('DOMContentLoaded', () => {
    GameEngine.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameEngine };
}
