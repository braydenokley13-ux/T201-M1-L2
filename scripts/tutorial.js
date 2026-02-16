// NBA GM Crisis Manager - Interactive Tutorial System
// Guides first-time users through the game mechanics

const Tutorial = {
    steps: [
        {
            id: 'welcome',
            title: 'Welcome to NBA GM Crisis Manager!',
            content: 'You\'re about to step into the shoes of an NBA General Manager. Your goal is to manage your team\'s roster, balance the budget, and hit performance targets.',
            target: null,
            position: 'center'
        },
        {
            id: 'select-team',
            title: 'Choose Your Team',
            content: 'Each team has a unique crisis scenario. Start with an EASY team like the Spurs to learn the basics.',
            target: '.team-selection-screen',
            position: 'center',
            highlight: '.team-card'
        },
        {
            id: 'scenario-intro',
            title: 'Understand the Scenario',
            content: 'Every scenario shows the team\'s current situation, roster, and ownership demands. Read carefully to know what you\'re up against.',
            target: '.team-intro-screen',
            position: 'center',
            waitForScreen: 'team-intro-screen'
        },
        {
            id: 'targets',
            title: 'Your Targets',
            content: 'You must hit ALL THREE targets to earn your claim code: Wins, Performance Points, and stay under the Max Spend budget.',
            target: '.targets-grid',
            position: 'bottom',
            highlight: '.target-item',
            waitForScreen: 'team-intro-screen'
        },
        {
            id: 'enter-gm-mode',
            title: 'Enter GM Mode',
            content: 'Click "Enter GM Mode" to start making roster decisions.',
            target: '#enter-gm-btn',
            position: 'top',
            highlight: '#enter-gm-btn',
            waitForScreen: 'team-intro-screen'
        },
        {
            id: 'move-categories',
            title: 'Move Categories',
            content: 'Moves are organized into 6 categories: Trades, Free Agency, Extensions, Development, Savings, and Status Quo. Each affects your roster differently.',
            target: '.category-tabs',
            position: 'bottom',
            highlight: '.tab-btn',
            waitForScreen: 'game-screen'
        },
        {
            id: 'select-moves',
            title: 'Select Your Moves',
            content: 'Click on move cards to select them. You can choose up to 5 moves. Each move shows its impact on payroll, wins, and performance.',
            target: '.moves-container',
            position: 'right',
            highlight: '.move-card',
            waitForScreen: 'game-screen'
        },
        {
            id: 'live-stats',
            title: 'Live Dashboard',
            content: 'Watch these stats update in real-time as you select moves. Green means you\'re hitting the target, red means you\'re missing it.',
            target: '.ownership-demands',
            position: 'right',
            highlight: '.demand-item',
            waitForScreen: 'game-screen'
        },
        {
            id: 'luxury-tax',
            title: 'Luxury Tax Explained',
            content: 'The Luxury Tax is a penalty for teams spending over $171M. It\'s calculated on progressive brackets and adds to your total spend. Hover over terms for definitions.',
            target: '.ownership-demands',
            position: 'right',
            waitForScreen: 'game-screen'
        },
        {
            id: 'simulate',
            title: 'Simulate the Season',
            content: 'When you\'re ready, click "Simulate Season" to see how your decisions play out. You\'ll get detailed feedback on your performance.',
            target: '#simulate-btn',
            position: 'top',
            highlight: '#simulate-btn',
            waitForScreen: 'game-screen'
        },
        {
            id: 'complete',
            title: 'You\'re Ready!',
            content: 'That\'s all you need to know. Try to hit all three targets to earn your claim code. Good luck, GM!',
            target: null,
            position: 'center'
        }
    ],

    currentStep: 0,
    active: false,
    overlay: null,
    tooltip: null,
    glossary: [],

    async init() {
        // Load glossary
        await this.loadGlossary();

        // Check if user has completed tutorial
        if (Storage.getSetting('tutorialCompleted')) {
            return;
        }

        // Create tutorial UI elements
        this.createOverlay();
        this.createTooltip();

        // Show tutorial on first load
        this.show();
    },

    async loadGlossary() {
        try {
            const response = await fetch('data/glossary.json');
            this.glossary = await response.json();
        } catch (e) {
            console.error('Failed to load glossary:', e);
            this.glossary = [];
        }
    },

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        this.overlay.style.display = 'none';
        document.body.appendChild(this.overlay);

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.skip();
            }
        });
    },

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tutorial-tooltip';
        this.tooltip.innerHTML = `
            <div class="tutorial-tooltip-header">
                <h3 class="tutorial-tooltip-title"></h3>
                <button class="tutorial-tooltip-close" aria-label="Close tutorial">&times;</button>
            </div>
            <div class="tutorial-tooltip-content"></div>
            <div class="tutorial-tooltip-footer">
                <button class="tutorial-btn-skip">Skip Tutorial</button>
                <div class="tutorial-tooltip-nav">
                    <span class="tutorial-progress"></span>
                    <button class="tutorial-btn-prev">Previous</button>
                    <button class="tutorial-btn-next">Next</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.tooltip);

        // Bind events
        this.tooltip.querySelector('.tutorial-btn-next').addEventListener('click', () => this.next());
        this.tooltip.querySelector('.tutorial-btn-prev').addEventListener('click', () => this.prev());
        this.tooltip.querySelector('.tutorial-btn-skip').addEventListener('click', () => this.skip());
        this.tooltip.querySelector('.tutorial-tooltip-close').addEventListener('click', () => this.skip());
    },

    show() {
        this.active = true;
        this.currentStep = 0;
        this.overlay.style.display = 'block';
        this.showStep(this.currentStep);
    },

    hide() {
        this.active = false;
        this.overlay.style.display = 'none';
        this.tooltip.style.display = 'none';
        this.clearHighlights();
    },

    skip() {
        this.hide();
        Storage.updateSetting('tutorialCompleted', true);
    },

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            // Tutorial complete
            this.skip();
        }
    },

    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    },

    showStep(stepIndex) {
        const step = this.steps[stepIndex];

        // Update tooltip content
        this.tooltip.querySelector('.tutorial-tooltip-title').textContent = step.title;
        this.tooltip.querySelector('.tutorial-tooltip-content').textContent = step.content;
        this.tooltip.querySelector('.tutorial-progress').textContent = `${stepIndex + 1} / ${this.steps.length}`;

        // Update navigation buttons
        this.tooltip.querySelector('.tutorial-btn-prev').disabled = stepIndex === 0;
        this.tooltip.querySelector('.tutorial-btn-next').textContent =
            stepIndex === this.steps.length - 1 ? 'Finish' : 'Next';

        // Clear previous highlights
        this.clearHighlights();

        // Position tooltip
        if (step.target) {
            const targetEl = document.querySelector(step.target);
            if (targetEl && targetEl.offsetParent !== null) {
                // Element is visible
                this.positionTooltip(targetEl, step.position);
                this.tooltip.style.display = 'block';

                // Highlight target
                if (step.highlight) {
                    this.highlightElements(step.highlight);
                }
            } else if (step.waitForScreen) {
                // Element not visible yet, wait for screen change
                this.tooltip.style.display = 'none';
                this.waitForScreen(step.waitForScreen, () => {
                    this.showStep(stepIndex);
                });
                return;
            }
        } else {
            // Center tooltip
            this.tooltip.style.display = 'block';
            this.tooltip.style.position = 'fixed';
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%)';
        }
    },

    positionTooltip(targetEl, position) {
        const rect = targetEl.getBoundingClientRect();
        this.tooltip.style.position = 'fixed';

        switch (position) {
            case 'top':
                this.tooltip.style.top = `${rect.top - this.tooltip.offsetHeight - 20}px`;
                this.tooltip.style.left = `${rect.left + rect.width / 2}px`;
                this.tooltip.style.transform = 'translateX(-50%)';
                break;
            case 'bottom':
                this.tooltip.style.top = `${rect.bottom + 20}px`;
                this.tooltip.style.left = `${rect.left + rect.width / 2}px`;
                this.tooltip.style.transform = 'translateX(-50%)';
                break;
            case 'left':
                this.tooltip.style.top = `${rect.top + rect.height / 2}px`;
                this.tooltip.style.left = `${rect.left - this.tooltip.offsetWidth - 20}px`;
                this.tooltip.style.transform = 'translateY(-50%)';
                break;
            case 'right':
                this.tooltip.style.top = `${rect.top + rect.height / 2}px`;
                this.tooltip.style.left = `${rect.right + 20}px`;
                this.tooltip.style.transform = 'translateY(-50%)';
                break;
            case 'center':
            default:
                this.tooltip.style.top = '50%';
                this.tooltip.style.left = '50%';
                this.tooltip.style.transform = 'translate(-50%, -50%)';
        }
    },

    highlightElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('tutorial-highlight');
        });
    },

    clearHighlights() {
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    },

    waitForScreen(screenId, callback) {
        // Set up observer to wait for screen to become visible
        const observer = new MutationObserver(() => {
            const screen = document.getElementById(screenId);
            if (screen && screen.classList.contains('active')) {
                observer.disconnect();
                setTimeout(callback, 300); // Wait for transition
            }
        });

        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        });
    },

    // Show glossary tooltip for a term
    showGlossaryTooltip(term, targetEl) {
        const entry = this.glossary.find(e => e.term.toLowerCase() === term.toLowerCase());
        if (!entry) return;

        const glossaryTooltip = document.createElement('div');
        glossaryTooltip.className = 'glossary-tooltip';
        glossaryTooltip.innerHTML = `
            <h4>${entry.term}</h4>
            <p>${entry.definition}</p>
            ${entry.example ? `<p class="example"><strong>Example:</strong> ${entry.example}</p>` : ''}
        `;

        document.body.appendChild(glossaryTooltip);

        const rect = targetEl.getBoundingClientRect();
        glossaryTooltip.style.position = 'fixed';
        glossaryTooltip.style.top = `${rect.bottom + 10}px`;
        glossaryTooltip.style.left = `${rect.left}px`;

        // Remove on click outside
        const removeTooltip = (e) => {
            if (!glossaryTooltip.contains(e.target) && e.target !== targetEl) {
                glossaryTooltip.remove();
                document.removeEventListener('click', removeTooltip);
            }
        };
        setTimeout(() => document.addEventListener('click', removeTooltip), 100);
    }
};

// Initialize tutorial on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        Tutorial.init();
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Tutorial };
}
