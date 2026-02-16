// NBA GM Crisis Manager - LocalStorage Persistence
// Handles save/load game state, achievements, and progress tracking

const Storage = {
    STORAGE_KEY: 'nba-gm-crisis-manager',
    VERSION: '2.0',

    // Initialize storage with default structure
    init() {
        if (!this.hasData()) {
            this.resetAll();
        } else {
            // Migrate old versions if needed
            const data = this.getData();
            if (data.version !== this.VERSION) {
                this.migrate(data);
            }
        }
    },

    // Check if storage exists
    hasData() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    },

    // Get all storage data
    getData() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : this.getDefaultData();
        } catch (e) {
            console.error('Failed to parse storage data:', e);
            return this.getDefaultData();
        }
    },

    // Save all storage data
    setData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Failed to save storage data:', e);
            // Handle quota exceeded
            if (e.name === 'QuotaExceededError') {
                this.cleanup();
                try {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
                    return true;
                } catch (e2) {
                    console.error('Failed to save even after cleanup:', e2);
                    return false;
                }
            }
            return false;
        }
    },

    // Get default storage structure
    getDefaultData() {
        return {
            version: this.VERSION,
            teams: {
                bucks: { bestStars: 0, bestScore: 0, attempts: 0, completed: false },
                cavaliers: { bestStars: 0, bestScore: 0, attempts: 0, completed: false },
                warriors: { bestStars: 0, bestScore: 0, attempts: 0, completed: false },
                thunder: { bestStars: 0, bestScore: 0, attempts: 0, completed: false },
                spurs: { bestStars: 0, bestScore: 0, attempts: 0, completed: false }
            },
            achievements: [],
            currentGame: null,
            settings: {
                tutorialCompleted: false,
                soundEnabled: true,
                theme: 'dark'
            },
            stats: {
                totalGamesPlayed: 0,
                totalGamesWon: 0,
                totalAchievements: 0,
                firstPlayDate: Date.now(),
                lastPlayDate: Date.now()
            }
        };
    },

    // Reset all storage
    resetAll() {
        this.setData(this.getDefaultData());
    },

    // Cleanup old data to free space
    cleanup() {
        const data = this.getData();
        // Clear current game if it's old (more than 7 days)
        if (data.currentGame && data.currentGame.timestamp) {
            const daysSince = (Date.now() - data.currentGame.timestamp) / (1000 * 60 * 60 * 24);
            if (daysSince > 7) {
                data.currentGame = null;
            }
        }
        this.setData(data);
    },

    // Migrate from old versions
    migrate(oldData) {
        const newData = this.getDefaultData();
        // Preserve what we can from old data
        if (oldData.teams) newData.teams = { ...newData.teams, ...oldData.teams };
        if (oldData.achievements) newData.achievements = oldData.achievements;
        if (oldData.settings) newData.settings = { ...newData.settings, ...oldData.settings };
        newData.version = this.VERSION;
        this.setData(newData);
    },

    // === CURRENT GAME METHODS ===

    // Save current game state
    saveCurrentGame(teamId, selectedMoves) {
        const data = this.getData();
        data.currentGame = {
            teamId,
            selectedMoves: selectedMoves.map(m => ({
                id: m.id,
                category: m.category,
                title: m.title
            })),
            timestamp: Date.now()
        };
        this.setData(data);
    },

    // Get saved game
    getCurrentGame() {
        const data = this.getData();
        return data.currentGame;
    },

    // Clear saved game
    clearCurrentGame() {
        const data = this.getData();
        data.currentGame = null;
        this.setData(data);
    },

    // Check if there's a saved game
    hasSavedGame() {
        const game = this.getCurrentGame();
        return game !== null && game.teamId && game.selectedMoves;
    },

    // === TEAM PROGRESS METHODS ===

    // Update team stats after completing a scenario
    updateTeamStats(teamId, results) {
        const data = this.getData();
        const team = data.teams[teamId] || { bestStars: 0, bestScore: 0, attempts: 0, completed: false };

        team.attempts += 1;

        if (results.success) {
            team.completed = true;
            if (results.stars > team.bestStars) {
                team.bestStars = results.stars;
            }
            if (results.efficiencyScore > team.bestScore) {
                team.bestScore = results.efficiencyScore;
            }
        }

        data.teams[teamId] = team;
        data.stats.totalGamesPlayed += 1;
        if (results.success) {
            data.stats.totalGamesWon += 1;
        }
        data.stats.lastPlayDate = Date.now();

        this.setData(data);
    },

    // Get team stats
    getTeamStats(teamId) {
        const data = this.getData();
        return data.teams[teamId] || { bestStars: 0, bestScore: 0, attempts: 0, completed: false };
    },

    // Get all team stats
    getAllTeamStats() {
        const data = this.getData();
        return data.teams;
    },

    // === ACHIEVEMENT METHODS ===

    // Unlock achievement
    unlockAchievement(achievementId) {
        const data = this.getData();
        if (!data.achievements.includes(achievementId)) {
            data.achievements.push(achievementId);
            data.stats.totalAchievements = data.achievements.length;
            this.setData(data);
            return true; // Newly unlocked
        }
        return false; // Already unlocked
    },

    // Check if achievement is unlocked
    hasAchievement(achievementId) {
        const data = this.getData();
        return data.achievements.includes(achievementId);
    },

    // Get all unlocked achievements
    getAchievements() {
        const data = this.getData();
        return data.achievements;
    },

    // Get achievement count
    getAchievementCount() {
        return this.getAchievements().length;
    },

    // === SETTINGS METHODS ===

    // Update setting
    updateSetting(key, value) {
        const data = this.getData();
        data.settings[key] = value;
        this.setData(data);
    },

    // Get setting
    getSetting(key) {
        const data = this.getData();
        return data.settings[key];
    },

    // Get all settings
    getSettings() {
        const data = this.getData();
        return data.settings;
    },

    // === STATS METHODS ===

    // Get global stats
    getStats() {
        const data = this.getData();
        return data.stats;
    },

    // Calculate derived stats
    getDerivedStats() {
        const data = this.getData();
        const completedTeams = Object.values(data.teams).filter(t => t.completed).length;
        const totalStars = Object.values(data.teams).reduce((sum, t) => sum + t.bestStars, 0);
        const winRate = data.stats.totalGamesPlayed > 0
            ? Math.round((data.stats.totalGamesWon / data.stats.totalGamesPlayed) * 100)
            : 0;

        return {
            completedTeams,
            totalStars,
            winRate,
            achievementProgress: `${data.achievements.length}/20` // Assuming 20 total achievements
        };
    },

    // === EXPORT/IMPORT ===

    // Export all data as JSON
    exportData() {
        return JSON.stringify(this.getData(), null, 2);
    },

    // Import data from JSON
    importData(jsonString) {
        try {
            const importedData = JSON.parse(jsonString);
            // Validate structure
            if (importedData.version && importedData.teams) {
                this.setData(importedData);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Failed to import data:', e);
            return false;
        }
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    Storage.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Storage };
}
