// NBA GM Crisis Manager - Move Definitions
// Move pools by category for roster decisions

const MOVES = [
    // Trades (12)
    {
        id: 'trade-star-wing',
        category: 'trades',
        title: 'Trade for a Two-Way Star Wing',
        trade: { give: '2 first-round picks + starter', get: 'All-Star wing' },
        description: 'Adds an elite scorer and defender to close games.',
        impact: { payroll: 18, wins: 5, playoffWins: 1, perfPoints: 6 },
        scout: 'Big win now move, expensive long term.'
    },
    {
        id: 'trade-floor-general',
        category: 'trades',
        title: 'Acquire Veteran Floor General',
        trade: { give: 'Bench guards + pick swap', get: 'Veteran PG' },
        description: 'Stabilizes late-game offense and reduces turnovers.',
        impact: { payroll: 8, wins: 3, playoffWins: 0, perfPoints: 3 },
        scout: 'Raises your floor without sacrificing future picks.'
    },
    {
        id: 'trade-rim-protector',
        category: 'trades',
        title: 'Add Elite Rim Protector',
        trade: { give: 'Young big + 2nd rounder', get: 'Shot-blocking center' },
        description: 'Anchors the defense and improves rebounding.',
        impact: { payroll: 6, wins: 2, playoffWins: 1, perfPoints: 4 },
        scout: 'Defensive ceiling rises, offense stays steady.'
    },
    {
        id: 'trade-shooting-guard',
        category: 'trades',
        title: 'Trade for High-Volume Shooter',
        trade: { give: 'Late 1st + rotation wing', get: 'Elite shooter' },
        description: 'Opens the floor for your star and boosts spacing.',
        impact: { payroll: 9, wins: 3, playoffWins: 0, perfPoints: 3 },
        scout: 'Great regular-season boost, defense can be targeted.'
    },
    {
        id: 'trade-cost-cutting',
        category: 'trades',
        title: 'Cost-Cutting Salary Dump',
        trade: { give: 'Overpaid veteran', get: 'Expiring contracts' },
        description: 'Sheds money now to avoid second apron penalties.',
        impact: { payroll: -16, wins: -2, playoffWins: -1, perfPoints: -3 },
        scout: 'Fans will grumble, ownership will cheer.'
    },
    {
        id: 'trade-superstar-swing',
        category: 'trades',
        title: 'All-In Superstar Swing',
        trade: { give: '3 first-round picks + 2 starters', get: 'Top-10 superstar' },
        description: 'Pushes your roster into true title contention.',
        impact: { payroll: 28, wins: 7, playoffWins: 2, perfPoints: 10 },
        scout: 'Massive upside with serious future risk.'
    },
    {
        id: 'trade-versatile-forward',
        category: 'trades',
        title: 'Swap for Versatile Forward',
        trade: { give: 'Young wing + pick', get: 'Two-way forward' },
        description: 'Adds switchability and secondary playmaking.',
        impact: { payroll: 7, wins: 2, playoffWins: 0, perfPoints: 2 },
        scout: 'Steady upgrade, not a home run.'
    },
    {
        id: 'trade-future-assets',
        category: 'trades',
        title: 'Rebuild Move: Trade Star for Picks',
        trade: { give: 'Best player + salary filler', get: '3 unprotected 1sts + young prospect' },
        description: 'Full tank mode. Sell your star for future assets.',
        impact: { payroll: -18, wins: -8, playoffWins: -2, perfPoints: -10 },
        scout: 'Nuclear option for rebuilds. Ownership must approve.'
    },
    {
        id: 'trade-accept-bad-contract',
        category: 'trades',
        title: 'Rebuild Move: Accept Bad Contract',
        trade: { give: 'Expiring contracts', get: 'Overpaid vet + 2 first-round picks' },
        description: 'Take on salary dumps in exchange for draft capital.',
        impact: { payroll: 12, wins: -1, playoffWins: 0, perfPoints: -2 },
        scout: 'Classic tank move. Use cap space for picks.'
    },
    {
        id: 'trade-sell-expirings',
        category: 'trades',
        title: 'Rebuild Move: Flip All Expiring Deals',
        trade: { give: 'All expiring contracts', get: 'Future 1st + young players' },
        description: 'Convert expirings to long-term assets before deadline.',
        impact: { payroll: -8, wins: -2, playoffWins: 0, perfPoints: -3 },
        scout: 'Smart tank strategy for deadline deals.'
    },
    {
        id: 'trade-playoff-veteran',
        category: 'trades',
        title: 'Add Playoff-Tested Veteran',
        trade: { give: 'Young bench + 2nd', get: 'Playoff vet' },
        description: 'Steadying presence for high-pressure games.',
        impact: { payroll: 4, wins: 1, playoffWins: 1, perfPoints: 3 },
        scout: 'Small wins bump, playoff value is real.'
    },
    {
        id: 'trade-athletic-center',
        category: 'trades',
        title: 'Acquire Athletic Roll Man',
        trade: { give: 'Backup big + cash', get: 'Athletic center' },
        description: 'Improves pick-and-roll efficiency and rim pressure.',
        impact: { payroll: 5, wins: 1, playoffWins: 0, perfPoints: 1 },
        scout: 'Helps offense, defense stays neutral.'
    },
    {
        id: 'trade-defensive-stopgap',
        category: 'trades',
        title: 'Bring in Defensive Stopgap',
        trade: { give: '2nd rounder', get: 'Lockdown defender' },
        description: 'Improves perimeter defense immediately.',
        impact: { payroll: 3, wins: 1, playoffWins: 0, perfPoints: 1 },
        scout: 'Low cost, modest boost.'
    },
    {
        id: 'trade-injury-risk',
        category: 'trades',
        title: 'Trade for Injury-Prone Star',
        trade: { give: 'Two rotation pieces', get: 'High-upside star' },
        description: 'Gives huge upside if the star stays healthy.',
        impact: { payroll: 14, wins: 4, playoffWins: 1, perfPoints: 5 },
        warning: 'Medical risk is significant.',
        scout: 'Boom-or-bust move.'
    },

    // Free Agency (5)
    {
        id: 'fa-full-mle',
        category: 'free-agency',
        title: 'Use Full MLE on Starter',
        description: 'Brings in a reliable starter using the mid-level exception.',
        impact: { payroll: 8, wins: 2, playoffWins: 0, perfPoints: 2 },
        scout: 'Solid rotation boost.'
    },
    {
        id: 'fa-bargain-vet',
        category: 'free-agency',
        title: 'Sign Bargain Veteran',
        description: 'Adds experienced depth without heavy cost.',
        impact: { payroll: 2, wins: 1, playoffWins: 0, perfPoints: 1 },
        scout: 'Reliable but low ceiling.'
    },
    {
        id: 'fa-defensive-wing',
        category: 'free-agency',
        title: 'Sign Defensive Wing Specialist',
        description: 'Improves defensive matchups against elite scorers.',
        impact: { payroll: 4, wins: 1, playoffWins: 1, perfPoints: 3 },
        scout: 'Playoff value is higher than regular season impact.'
    },
    {
        id: 'fa-shooting-big',
        category: 'free-agency',
        title: 'Add Stretch Big',
        description: 'Creates spacing and keeps the lane open.',
        impact: { payroll: 5, wins: 1, playoffWins: 0, perfPoints: 1 },
        scout: 'Useful against drop coverage.'
    },
    {
        id: 'fa-risky-scorer',
        category: 'free-agency',
        title: 'Sign High-Variance Scorer',
        description: 'Instant offense but can hurt defense.',
        impact: { payroll: 6, wins: 2, playoffWins: 0, perfPoints: 1 },
        warning: 'Defense may take a hit in key matchups.',
        scout: 'Great if you can hide them defensively.'
    },

    // Extensions (3)
    {
        id: 'ext-lock-star',
        category: 'extensions',
        title: 'Lock Up Franchise Star',
        description: 'Secures your best player long-term, avoiding drama.',
        impact: { payroll: 12, wins: 2, playoffWins: 0, perfPoints: 2 },
        scout: 'Keeps morale high and stability intact.'
    },
    {
        id: 'ext-team-friendly',
        category: 'extensions',
        title: 'Negotiate Team-Friendly Extension',
        description: 'Shorter deal with incentives to control costs.',
        impact: { payroll: -4, wins: 0, playoffWins: 0, perfPoints: 1 },
        scout: 'Great for flexibility, may create tension.'
    },
    {
        id: 'ext-bridge-deal',
        category: 'extensions',
        title: 'Bridge Deal for Young Talent',
        description: 'Maintains continuity while evaluating growth.',
        impact: { payroll: 3, wins: 1, playoffWins: 0, perfPoints: 1 },
        scout: 'Low risk, moderate upside.'
    },

    // Development (4)
    {
        id: 'dev-player-lab',
        category: 'development',
        title: 'Expand Player Development Lab',
        description: 'Invest in coaching, analytics, and training.',
        impact: { payroll: 3, wins: 1, playoffWins: 0, perfPoints: 2 },
        scout: 'Future gains compound quickly.'
    },
    {
        id: 'dev-chemistry',
        category: 'development',
        title: 'Team Chemistry Retreat',
        description: 'Improves communication and late-game execution.',
        impact: { payroll: 1, wins: 1, playoffWins: 0, perfPoints: 1 },
        scout: 'Small but consistent boost.'
    },
    {
        id: 'dev-load-management',
        category: 'development',
        title: 'Adopt Load Management Plan',
        description: 'Keeps stars healthy but may cost regular-season wins.',
        impact: { payroll: 0, wins: -1, playoffWins: 1, perfPoints: 2 },
        scout: 'Playoff benefit, regular-season dip.'
    },
    {
        id: 'dev-rookie-focus',
        category: 'development',
        title: 'Give Rookies Real Minutes',
        description: 'Accelerates development with short-term bumps.',
        impact: { payroll: 0, wins: -1, playoffWins: 0, perfPoints: 1 },
        scout: 'Good for the future, risky now.'
    },

    // Savings (6)
    {
        id: 'save-non-guaranteed',
        category: 'savings',
        title: 'Waive Non-Guaranteed Contracts',
        description: 'Clears short-term salary and opens roster spots.',
        impact: { payroll: -6, wins: -1, playoffWins: 0, perfPoints: -1 },
        scout: 'Minimal on-court impact, good for the books.'
    },
    {
        id: 'save-buyout',
        category: 'savings',
        title: 'Negotiate Buyout with Veteran',
        description: 'Saves cap space with a mutual parting.',
        impact: { payroll: -8, wins: -1, playoffWins: 0, perfPoints: -1 },
        scout: 'Freed money helps flexibility.'
    },
    {
        id: 'save-two-way',
        category: 'savings',
        title: 'Convert Bench to Two-Way Deals',
        description: 'Cheap depth moves for younger players.',
        impact: { payroll: -4, wins: -1, playoffWins: 0, perfPoints: -1 },
        scout: 'Good for cap, not for immediate wins.'
    },
    {
        id: 'save-coaching',
        category: 'savings',
        title: 'Cut Auxiliary Coaching Staff',
        description: 'Reduces overhead at the cost of marginal development.',
        impact: { payroll: -2, wins: 0, playoffWins: 0, perfPoints: -1 },
        scout: 'Small savings, modest downside.'
    },
    {
        id: 'save-trade-down',
        category: 'savings',
        title: 'Trade Down in Draft',
        description: 'Acquires cheaper contracts and future picks.',
        impact: { payroll: -5, wins: -1, playoffWins: 0, perfPoints: -1 },
        scout: 'Flexibility win, talent cost.'
    },
    {
        id: 'save-mle',
        category: 'savings',
        title: 'Avoid Using the MLE',
        description: 'Keeps payroll down but limits roster upgrades.',
        impact: { payroll: -7, wins: -1, playoffWins: 0, perfPoints: -2 },
        scout: 'Maximizes savings, lowers competitiveness.'
    },
    {
        id: 'save-waive-stretch',
        category: 'savings',
        title: 'Waive and Stretch Expensive Vet',
        description: 'Use stretch provision to spread dead cap over 3 years.',
        impact: { payroll: -12, wins: -3, playoffWins: -1, perfPoints: -4 },
        scout: 'Painful short-term, but opens max slot next year.'
    },
    {
        id: 'save-amnesty-deal',
        category: 'savings',
        title: 'Amnesty Bad Contract (If Available)',
        description: 'Use one-time amnesty to clear terrible deal off books.',
        impact: { payroll: -22, wins: -1, playoffWins: 0, perfPoints: -2 },
        scout: 'Instant cap relief but you lose the player.'
    },
    {
        id: 'save-decline-options',
        category: 'savings',
        title: 'Decline All Team Options',
        description: 'Cut loose borderline players to save money.',
        impact: { payroll: -10, wins: -2, playoffWins: 0, perfPoints: -3 },
        scout: 'Smart if you need flexibility for free agency.'
    },

    // Status Quo (4)
    {
        id: 'status-runback',
        category: 'status-quo',
        title: 'Run It Back',
        description: 'Trust current roster to grow together.',
        impact: { payroll: 0, wins: 1, playoffWins: 0, perfPoints: 1 },
        scout: 'Continuity often yields small gains.'
    },
    {
        id: 'status-hold-assets',
        category: 'status-quo',
        title: 'Hold Assets for Deadline',
        description: 'Stay flexible to make in-season deals.',
        impact: { payroll: 0, wins: 0, playoffWins: 0, perfPoints: 0 },
        scout: 'Neutral but keeps options open.'
    },
    {
        id: 'status-chemistry',
        category: 'status-quo',
        title: 'Protect Locker Room Chemistry',
        description: 'Avoids major changes to keep morale strong.',
        impact: { payroll: 0, wins: 1, playoffWins: 0, perfPoints: 1 },
        scout: 'Stability matters for veteran teams.'
    },
    {
        id: 'status-defer',
        category: 'status-quo',
        title: 'Defer Big Decisions',
        description: 'Wait for more data before committing.',
        impact: { payroll: 0, wins: 0, playoffWins: 0, perfPoints: 0 },
        scout: 'Low risk, low reward.'
    },
    {
        id: 'dev-tank-for-picks',
        category: 'development',
        title: 'Tank for Top Draft Pick',
        description: 'Shut down vets, play young guys, lose games strategically.',
        impact: { payroll: -3, wins: -10, playoffWins: -2, perfPoints: -12 },
        scout: 'Fans will hate it but future could be bright.'
    },
    {
        id: 'dev-youth-movement',
        category: 'development',
        title: 'Full Youth Movement',
        description: 'Trade all vets 28+, commit to player development.',
        impact: { payroll: -14, wins: -6, playoffWins: -1, perfPoints: -8 },
        scout: 'Multi-year rebuild plan. Patience required.'
    }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MOVES };
}
