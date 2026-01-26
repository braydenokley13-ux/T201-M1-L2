// NBA GM Crisis Manager - Tax & Performance Calculations
// Handles luxury tax logic and performance scoring

const Calculator = {
    calculateLuxuryTax(payroll, isRepeater, taxConfig = TAX_CONFIG) {
        if (payroll <= taxConfig.luxuryTaxLine) {
            return { tax: 0, breakdown: [], taxableAmount: 0 };
        }

        const brackets = [
            { limit: 5, rate: 1.5 },
            { limit: 5, rate: 1.75 },
            { limit: 5, rate: 2.5 },
            { limit: 5, rate: 3.25 },
            { limit: 5, rate: 3.75 },
            { limit: 5, rate: 4.25 },
            { limit: 5, rate: 4.75 },
            { limit: 5, rate: 5.25 }
        ];

        const repeaterAdd = isRepeater ? 1.0 : 0;
        let remaining = payroll - taxConfig.luxuryTaxLine;
        let taxTotal = 0;
        const breakdown = [];

        brackets.forEach((bracket, index) => {
            if (remaining <= 0) {
                return;
            }
            const taxable = Math.min(bracket.limit, remaining);
            const rate = bracket.rate + repeaterAdd;
            const amount = taxable * rate;
            taxTotal += amount;
            breakdown.push({
                bracket: index + 1,
                taxable,
                rate,
                amount
            });
            remaining -= taxable;
        });

        if (remaining > 0) {
            const rate = 5.75 + repeaterAdd;
            const amount = remaining * rate;
            taxTotal += amount;
            breakdown.push({
                bracket: brackets.length + 1,
                taxable: remaining,
                rate,
                amount
            });
        }

        return {
            tax: Math.round(taxTotal),
            breakdown,
            taxableAmount: payroll - taxConfig.luxuryTaxLine
        };
    },

    calculatePerformancePoints(wins, playoffWins, bonuses) {
        const baseScore = wins * bonuses.regWinWeight + playoffWins * bonuses.playoffWinWeight;
        const fiftyBonus = wins >= 50 ? bonuses.fiftyWinBonus : 0;
        const sixtyBonus = wins >= 60 ? bonuses.sixtyWinBonus : 0;
        return Math.round(baseScore + fiftyBonus + sixtyBonus);
    },

    formatCurrency(value) {
        return `$${Math.round(value)}M`;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Calculator };
}
