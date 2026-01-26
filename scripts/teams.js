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
