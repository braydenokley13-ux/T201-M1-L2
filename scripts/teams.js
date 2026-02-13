// NBA GM Crisis Manager - Team Configurations
// All 5 teams with real 2026 rosters and scenarios
 
const TEAMS = {
    bucks: {
        id: 'bucks',
        name: 'Milwaukee Bucks',
        shortName: 'BUCKS',
        emoji: '🦌',
        scenario: 'Injury Crisis & Reset',
        difficulty: 2,
        claimCode: 'L2-201-M1-GMN',
        colors: {
            primary: '#00471b',
            secondary: '#eee1c6'
        },
        situation: {
            description: 'Lillard tore his Achilles and was waived. Middleton was traded to Washington. Lopez left for the Clippers. Giannis is frustrated and considering his options.',
            challenge: 'Giannis is frustrated. Make the playoffs or he demands a trade.',
            record: '17-24',
            projectedWins: 34
        },
        roster: [
            'Giannis Antetokounmpo',
            'Myles Turner',
            'Bobby Portis',
            'Gary Trent Jr.',
            'Kyle Kuzma',
            'AJ Johnson',
            'MarJon Beauchamp'
        ],
        baseState: {
            payroll: 190,
            wins: 34,
            playoffWins: 0,
            isRepeater: false
        },
        targets: {
            wins: 44,
            perfPoints: 47,
            maxSpend: 250
        },
        bonuses: {
            regWinWeight: 1.0,
            playoffWinWeight: 3.0,
            fiftyWinBonus: 5,
            sixtyWinBonus: 8
        },
        moveContext: {
            'trade-star-wing': 'Pair Giannis with another All-Star — Milwaukee goes all-in.',
            'trade-floor-general': 'AJ Johnson is raw. A vet PG stabilizes things around Giannis.',
            'trade-rim-protector': 'Turner is solid, but a true shot-blocker changes the paint.',
            'trade-shooting-guard': 'Giannis needs shooters. Spacing is everything for his drives.',
            'trade-cost-cutting': 'Move Kuzma\'s deal. Fans will hate it, front office needs it.',
            'trade-superstar-swing': 'Mortgage the future to save Giannis\'s prime. Win now or lose him.',
            'trade-future-assets': 'Trade Portis for picks. Accept the rebuild around Giannis.',
            'trade-playoff-veteran': 'Someone who\'s been there. Giannis needs playoff-tested help.',
            'trade-injury-risk': 'High ceiling if healthy — but another injury could sink the season.',
            'ext-lock-star': 'Lock up Giannis long-term. Keep the franchise player happy.',
            'fa-full-mle': 'Use the MLE to get Giannis a real running mate.',
            'fa-defensive-wing': 'Someone to guard the other team\'s best wing next to Giannis.',
            'dev-load-management': 'Rest Giannis for playoffs. He can\'t carry 82 games alone.',
            'dev-rookie-focus': 'Give AJ Johnson and Beauchamp real minutes to develop.',
            'save-buyout': 'Free up cap space — the Bucks need flexibility badly.',
            'status-runback': 'Trust Giannis and Turner to gel. Chemistry takes time.'
        },
        starPlayer: 'Giannis',
        newspaper: 'Milwaukee Journal Sentinel',
        headlines: {
            success: 'BUCKS GM SAVES SEASON, MAKES PLAYOFFS!',
            failure: 'BUCKS MISS PLAYOFFS, GIANNIS DEMANDS TRADE!'
        },
        statements: {
            success: 'This GM made the right moves. I\'m staying in Milwaukee.',
            failure: 'I\'ve given this franchise everything. I need to be somewhere that can compete for titles.'
        }
    },
 
    cavaliers: {
        id: 'cavaliers',
        name: 'Cleveland Cavaliers',
        shortName: 'CAVS',
        emoji: '🏆',
        scenario: 'Second Apron Hell',
        difficulty: 3,
        claimCode: 'L2-201-M1-K4F',
        colors: {
            primary: '#860038',
            secondary: '#fdbb30'
        },
        situation: {
            description: 'Most expensive roster in NBA at $228.6M payroll. Tax penalty is $163.8M for a total bill of $392.4M. The ONLY team in the league violating the second apron.',
            challenge: 'We\'re hemorrhaging money. Win the title or slash payroll.',
            record: '48-34 (projected)',
            projectedWins: 48
        },
        roster: [
            'Donovan Mitchell ($46.3M)',
            'Evan Mobley ($46.3M)',
            'Darius Garland ($39.4M)',
            'Jarrett Allen ($20M)',
            'De\'Andre Hunter ($23.3M)',
            'Isaac Okoro',
            'Max Strus'
        ],
        baseState: {
            payroll: 228,
            wins: 48,
            playoffWins: 2,
            isRepeater: true
        },
        targets: {
            wins: 52,
            perfPoints: 62,
            maxSpend: 280
        },
        bonuses: {
            regWinWeight: 1.0,
            playoffWinWeight: 3.0,
            fiftyWinBonus: 5,
            sixtyWinBonus: 8
        },
        moveContext: {
            'trade-star-wing': 'A wing to match Mitchell and Mobley — the Big 3 becomes a Big 4.',
            'trade-cost-cutting': 'Move Hunter\'s $23M deal. Escape the second apron.',
            'trade-superstar-swing': 'Go even bigger. Pair Mitchell with a top-10 player and pray the tax bill works.',
            'trade-future-assets': 'Sell a starter for picks. Ownership wants the tax bill down NOW.',
            'trade-floor-general': 'Garland runs the show, but a backup PG keeps the offense flowing.',
            'trade-rim-protector': 'Allen is good — but can he anchor a title defense?',
            'trade-shooting-guard': 'More shooting around Mitchell means more open 3s.',
            'trade-playoff-veteran': 'This team needs someone who\'s been to the Finals.',
            'ext-lock-star': 'Extend Mobley. Lock in the franchise cornerstone for a decade.',
            'ext-team-friendly': 'Get Garland on a discount. Control the cap damage.',
            'fa-defensive-wing': 'Guard the East\'s elite wings. Tatum, Giannis — you need a stopper.',
            'save-non-guaranteed': 'Waive the back-end guys. Every dollar counts above the second apron.',
            'save-buyout': 'Buy out a veteran. $8M saved is $40M+ in tax relief for a repeater.',
            'save-mle': 'Don\'t use the MLE. At repeater tax rates, $7M costs $50M+ total.',
            'dev-load-management': 'Rest Mitchell and Mobley for playoffs. The regular season doesn\'t matter.',
            'status-runback': 'This roster made the semis. Trust the core to take the next step.'
        },
        starPlayer: 'Mitchell',
        newspaper: 'Cleveland Plain Dealer',
        headlines: {
            success: 'CAVS BREAK THROUGH! CHAMPIONSHIP CONTENDERS!',
            failure: 'CAVALIERS CRUSHED BY LUXURY TAX, OWNERSHIP FURIOUS!'
        },
        statements: {
            success: 'The front office gave us the tools. Now we finish the job.',
            failure: 'We can\'t keep paying this tax bill without winning it all. Something has to change.'
        }
    },
 
    warriors: {
        id: 'warriors',
        name: 'Golden State Warriors',
        shortName: 'WARRIORS',
        emoji: '🌉',
        scenario: 'Dynasty\'s Last Stand',
        difficulty: 3,
        claimCode: 'L2-201-M1-HHY',
        colors: {
            primary: '#1d428a',
            secondary: '#ffc72c'
        },
        situation: {
            description: 'Expensive aging roster at $207M payroll with $81.3M repeater tax penalty. Steph Curry is 37, Draymond Green is 35. Struggling to stay in playoff picture.',
            challenge: 'Steph\'s window is closing. One more run or we rebuild.',
            record: '42-40 (projected)',
            projectedWins: 42
        },
        roster: [
            'Stephen Curry',
            'Andrew Wiggins',
            'Draymond Green',
            'Jonathan Kuminga',
            'Brandin Podziemski',
            'Kevon Looney',
            'Moses Moody'
        ],
        baseState: {
            payroll: 207,
            wins: 42,
            playoffWins: 1,
            isRepeater: true
        },
        targets: {
            wins: 47,
            perfPoints: 53,
            maxSpend: 260
        },
        bonuses: {
            regWinWeight: 1.0,
            playoffWinWeight: 3.0,
            fiftyWinBonus: 5,
            sixtyWinBonus: 8
        },
        moveContext: {
            'trade-star-wing': 'Give Steph one more co-star. The dynasty deserves a proper ending.',
            'trade-cost-cutting': 'Move Wiggins. Shed $25M+ in salary and tax relief.',
            'trade-superstar-swing': 'One last blockbuster. Steph\'s window closes after this year.',
            'trade-future-assets': 'Sell Kuminga for picks. Accept the post-Curry era is coming.',
            'trade-floor-general': 'A veteran backup PG lets Steph rest without the offense dying.',
            'trade-rim-protector': 'Looney isn\'t enough. Steph needs a real rim protector behind him.',
            'trade-shooting-guard': 'More shooting = more Curry gravity. The math always works.',
            'trade-playoff-veteran': 'Someone who\'s been in the trenches with Draymond-level intensity.',
            'ext-lock-star': 'Extend Steph. He IS the franchise — keep him a Warrior for life.',
            'fa-defensive-wing': 'Guard the West\'s best. Luka, SGA — you need length.',
            'dev-load-management': 'Steph is 37. Rest him now, unleash him in April.',
            'dev-rookie-focus': 'Give Podziemski and Moody real playoff minutes.',
            'save-buyout': 'At repeater rates, every dollar saved is $6+ in tax savings.',
            'save-mle': 'Skip the MLE. Repeater tax makes every signing astronomically expensive.',
            'status-runback': 'Steph, Dray, Wiggs — the band plays one more show.'
        },
        starPlayer: 'Steph',
        newspaper: 'San Francisco Chronicle',
        headlines: {
            success: 'WARRIORS DYNASTY LIVES ON! CURRY LEADS PLAYOFF SURGE!',
            failure: 'WARRIORS DYNASTY ENDS WITH A WHIMPER'
        },
        statements: {
            success: 'We\'re not done yet. This team can still compete with anyone.',
            failure: 'I gave everything I had. Maybe it\'s time to have a different conversation.'
        }
    },
 
    thunder: {
        id: 'thunder',
        name: 'Oklahoma City Thunder',
        shortName: 'THUNDER',
        emoji: '⚡',
        scenario: 'Defend The Crown',
        difficulty: 3,
        claimCode: 'L2-201-M1-K6P',
        colors: {
            primary: '#007ac1',
            secondary: '#ef3b24'
        },
        situation: {
            description: 'Defending NBA Champions after beating Pacers in 2025 Finals. Record: 34-7 (best in league). Started 24-1, tying Warriors\' record. SGA is reigning MVP at 31.9 PPG.',
            challenge: 'We\'re the champs. Repeat or it\'s a failure.',
            record: '34-7 (60 projected)',
            projectedWins: 60
        },
        roster: [
            'Shai Gilgeous-Alexander (MVP)',
            'Jalen Williams',
            'Chet Holmgren',
            'Cason Wallace',
            'Lu Dort',
            'Isaiah Hartenstein',
            'Alex Caruso'
        ],
        baseState: {
            payroll: 165,
            wins: 60,
            playoffWins: 3,
            isRepeater: false
        },
        targets: {
            wins: 62,
            perfPoints: 75,
            maxSpend: 230
        },
        bonuses: {
            regWinWeight: 1.0,
            playoffWinWeight: 3.0,
            fiftyWinBonus: 5,
            sixtyWinBonus: 8
        },
        moveContext: {
            'trade-star-wing': 'Add another All-Star next to SGA. Dynasty move.',
            'trade-cost-cutting': 'OKC has assets to burn, but cutting salary risks the repeat.',
            'trade-superstar-swing': 'Trade the war chest of picks for a second MVP-caliber player.',
            'trade-future-assets': 'Sell a starter? SGA didn\'t win a ring to watch guys leave.',
            'trade-floor-general': 'SGA handles the ball, but a backup PG keeps the machine running.',
            'trade-rim-protector': 'Holmgren and Hartenstein hold the paint. Another big upgrades depth.',
            'trade-playoff-veteran': 'Caruso is great, but more playoff experience deepens the bench.',
            'trade-shooting-guard': 'More shooting around SGA and Jalen Williams opens everything.',
            'ext-lock-star': 'Extend SGA to the max. He\'s the MVP — pay him like it.',
            'ext-bridge-deal': 'Lock in Cason Wallace cheap before he breaks out.',
            'fa-defensive-wing': 'Dort is elite, but playoff rotations need a second lockdown wing.',
            'dev-load-management': 'SGA played 82 last year. Rest him for the repeat run.',
            'dev-player-lab': 'Invest in Holmgren and Wallace. The dynasty needs depth.',
            'status-runback': 'This team went 34-7. Don\'t fix what isn\'t broken.',
            'status-chemistry': 'Championship chemistry is fragile. Protect what you\'ve built.'
        },
        starPlayer: 'SGA',
        newspaper: 'The Oklahoman',
        headlines: {
            success: 'THUNDER REPEAT! DYNASTY BEGINS IN OKC!',
            failure: 'THUNDER STUMBLE IN TITLE DEFENSE'
        },
        statements: {
            success: 'We\'re just getting started. This is Year 1 of a dynasty.',
            failure: 'Falling short hurts. We had all the pieces and couldn\'t get it done.'
        }
    },
 
    spurs: {
        id: 'spurs',
        name: 'San Antonio Spurs',
        shortName: 'SPURS',
        emoji: '👽',
        scenario: 'Young Gun Playoff Push',
        difficulty: 1,
        claimCode: 'L2-201-M1-FB8',
        colors: {
            primary: '#c4ced4',
            secondary: '#000000'
        },
        situation: {
            description: 'Record: 31-14 (3rd in West). First playoffs in 7 years! Wemby averaging 24.3 PPG, 11.0 REB, 3.8 BLK (league leader). Stephon Castle is Rookie of the Year.',
            challenge: 'Wemby\'s development year. Make noise in playoffs without mortgaging future.',
            record: '31-14 (48 projected)',
            projectedWins: 48
        },
        roster: [
            'Victor Wembanyama',
            'Stephon Castle (ROY)',
            'Dylan Harper (2nd pick)',
            'De\'Aaron Fox',
            'Jeremy Sochan',
            'Keldon Johnson',
            'Devin Vassell'
        ],
        baseState: {
            payroll: 145,
            wins: 48,
            playoffWins: 0,
            isRepeater: false
        },
        targets: {
            wins: 50,
            perfPoints: 55,
            maxSpend: 190
        },
        bonuses: {
            regWinWeight: 1.0,
            playoffWinWeight: 3.0,
            fiftyWinBonus: 5,
            sixtyWinBonus: 8
        },
        moveContext: {
            'trade-star-wing': 'Pair Wemby with an All-Star. San Antonio becomes a contender overnight.',
            'trade-cost-cutting': 'Spurs have cap room — no need to dump salary.',
            'trade-superstar-swing': 'Go all-in around Wemby? Risky — he\'s only 21.',
            'trade-future-assets': 'Don\'t sell. This team\'s future IS its present.',
            'trade-floor-general': 'Fox runs the show, but a backup PG helps when he rests.',
            'trade-rim-protector': 'Wemby IS the rim protector. Focus on perimeter help instead.',
            'trade-shooting-guard': 'Wemby needs spacing. A shooter unlocks his passing.',
            'trade-playoff-veteran': 'First playoffs in 7 years — someone who\'s been there matters.',
            'ext-lock-star': 'Extend Wemby early. He\'s a generational talent — lock him in.',
            'ext-bridge-deal': 'Bridge deal for Castle. See if the ROY keeps developing.',
            'fa-defensive-wing': 'Another long defender next to Wemby? Opponents can\'t score inside.',
            'fa-bargain-vet': 'Cheap veteran depth. Don\'t overspend — the Spurs\' cap space is their weapon.',
            'dev-player-lab': 'Invest in Castle, Harper, and Wemby. The future is NOW.',
            'dev-rookie-focus': 'Give Harper and Castle big minutes. Develop the young core.',
            'dev-load-management': 'Wemby\'s body is precious. Don\'t burn him out in Year 3.',
            'status-runback': 'Fox + Wemby + Castle. Let the young core grow together.'
        },
        starPlayer: 'Wemby',
        newspaper: 'San Antonio Express-News',
        headlines: {
            success: 'SPURS ARE BACK! WEMBY LEADS PLAYOFF RETURN!',
            failure: 'SPURS PLAYOFF DREAMS FALL SHORT'
        },
        statements: {
            success: 'This is just the beginning. San Antonio is building something special.',
            failure: 'We\'re close. I trust this team to keep growing together.'
        }
    }
};
 
// Tax thresholds for 2025-26 season
const TAX_CONFIG = {
    salaryCap: 136,
    luxuryTaxLine: 165,
    firstApron: 178,
    secondApron: 189
};
 
// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TEAMS, TAX_CONFIG };
}
