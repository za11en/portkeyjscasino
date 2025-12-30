// --- 1. WEEKLY SCHEDULE ---
const WEEKLY_SCHEDULE = [
    {
        day: "Today",
        rewards: [
            { id: "ojo1", casino: "PlayOJO", logo: "playojo.png", reward: "Kick of the Day: Free Spin", type: "No Wager" },
            { id: "jc1", casino: "JackpotCity", logo: "jackpotcity.png", reward: "Bonus Wheel: Up to $50", type: "Credits" },
            { id: "mgm1", casino: "BetMGM", logo: "betmgm.png", reward: "Lion's Share Drop", type: "Cash" },
            { id: "br1", casino: "BetRivers", logo: "betrivers.svg", reward: "Daily Rush: $10 Bonus", type: "Bonus" },
            { id: "888a", casino: "888 Casino", logo: "888.svg", reward: "Daily Wish: Free Spins", type: "Spins" }
        ]
    },
    {
        day: "Tomorrow",
        rewards: [
            { id: "dk1", casino: "DraftKings", logo: "draftkings.png", reward: "Tuesday Tiers: 2x Crowns", type: "Loyalty" },
            { id: "ojo2", casino: "PlayOJO", logo: "playojo.png", reward: "Reel Spinoff: $1000 Prize", type: "Tourney" },
            { id: "party1", casino: "PartyCasino", logo: "party.png", reward: "Slot Tournament: 50 Spins", type: "Spins" },
            { id: "leo1", casino: "LeoVegas", logo: "leo.png", reward: "Lunchtime Drop: $5 Cash", type: "Cash" }
        ]
    },
    {
        day: "Next Day",
        rewards: [
            { id: "cs1", casino: "Caesars", logo: "caesars.png", reward: "Mystery Wed: Reward Credits", type: "Loyalty" },
            { id: "mgm2", casino: "BetMGM", logo: "betmgm.png", reward: "Wild Wednesday: $10 Bet", type: "Bet" },
            { id: "br2", casino: "BetRivers", logo: "betrivers.svg", reward: "Happy Hour: 2x Points", type: "Loyalty" }
        ]
    }
];

// --- 2. EXPANDED SLOTS DB ---
const SLOTS_DATA = {
    trending: [
        { name: "Big Bass Bonanza", provider: "Pragmatic", img: "bigbass.jpeg", rtp: "96.7%", vol: "High" },
        { name: "Starburst", provider: "NetEnt", img: "starburst.jpeg", rtp: "96.1%", vol: "Low" },
        { name: "Book of Dead", provider: "Play'n GO", img: "dead.jpeg", rtp: "96.2%", vol: "High" },
        { name: "Sweet Bonanza", provider: "Pragmatic", img: "sweet.jpeg", rtp: "96.5%", vol: "Med" },
        { name: "Wolf Gold", provider: "Pragmatic", img: "wolf.jpeg", rtp: "96.0%", vol: "Med" }
    ],
    high_rtp: [
        { name: "Blood Suckers", provider: "NetEnt", img: "blood.jpeg", rtp: "98.0%", vol: "Low" },
        { name: "White Rabbit", provider: "Big Time", img: "rabbit.jpeg", rtp: "97.7%", vol: "High" },
        { name: "Medusa Megaways", provider: "NextGen", img: "medusa.jpeg", rtp: "97.6%", vol: "High" },
        { name: "Guns N' Roses", provider: "NetEnt", img: "gnr.jpeg", rtp: "96.9%", vol: "Low" },
        { name: "Dead or Alive 2", provider: "NetEnt", img: "doa2.jpeg", rtp: "96.8%", vol: "High" }
    ],
    jackpots: [
        { name: "Mega Moolah", provider: "Microgaming", img: "moolah.jpeg", rtp: "88.1%", vol: "High" },
        { name: "Divine Fortune", provider: "NetEnt", img: "divine.jpeg", rtp: "96.6%", vol: "Med" },
        { name: "Age of the Gods", provider: "Playtech", img: "gods.jpeg", rtp: "95.0%", vol: "High" },
        { name: "Jackpot Giant", provider: "Playtech", img: "giant.jpeg", rtp: "94.2%", vol: "Med" },
        { name: "Hall of Gods", provider: "NetEnt", img: "hall.jpeg", rtp: "95.5%", vol: "Low" }
    ],
    megaways: [
        { name: "Bonanza Megaways", provider: "Big Time", img: "bonanza.jpeg", rtp: "96.0%", vol: "High" },
        { name: "Gonzo's Quest MW", provider: "Red Tiger", img: "gonzomw.jpeg", rtp: "96.0%", vol: "High" },
        { name: "Ted Megaways", provider: "Blueprint", img: "tedmw.jpeg", rtp: "96.0%", vol: "High" },
        { name: "Great Rhino MW", provider: "Pragmatic", img: "rhinomw.jpeg", rtp: "96.5%", vol: "High" },
        { name: "Monopoly MW", provider: "Big Time", img: "monopolymw.jpeg", rtp: "96.5%", vol: "High" }
    ],
    hold_win: [
        { name: "Money Train 2", provider: "Relax", img: "moneytrain2.jpeg", rtp: "96.4%", vol: "High" },
        { name: "Buffalo Power", provider: "Playson", img: "buffalo.jpeg", rtp: "95.0%", vol: "Med" },
        { name: "Gold Digger", provider: "iSoftBet", img: "golddigger.jpeg", rtp: "96.0%", vol: "Med" },
        { name: "Divine Links", provider: "Blueprint", img: "divinelinks.jpeg", rtp: "96.0%", vol: "Med" },
        { name: "Apollo Pays", provider: "Big Time", img: "apollo.jpeg", rtp: "96.6%", vol: "High" }
    ],
    classics: [
        { name: "Fire Joker", provider: "Play'n GO", img: "firejoker.jpeg", rtp: "96.0%", vol: "Med" },
        { name: "Break da Bank", provider: "Microgaming", img: "breakbank.jpeg", rtp: "95.7%", vol: "High" },
        { name: "Mega Joker", provider: "NetEnt", img: "megajoker.jpeg", rtp: "99.0%", vol: "High" },
        { name: "Jackpot 6000", provider: "NetEnt", img: "jp6000.jpeg", rtp: "98.8%", vol: "High" },
        { name: "Route 777", provider: "ELK", img: "route777.jpeg", rtp: "96.3%", vol: "High" }
    ]
};

const PAYMENTS_DB = [
    { name: "Interac", type: "Debit", time: "Instant" },
    { name: "Visa", type: "Card", time: "Instant" },
    { name: "MasterCard", type: "Card", time: "Instant" },
    { name: "PayPal", type: "E-Wallet", time: "24h" },
    { name: "Apple Pay", type: "Mobile", time: "Instant" }
];

// --- 3. SKILL ARTICLES (8 Articles) ---
const SKILL_ARTICLES = [
    {
        title: "The Law of Large Numbers",
        icon: "📊",
        content: "In a short session (100 spins), luck dominates. Over 1,000,000 spins, math dominates. The casino doesn't gamble; they invest in the certainty of the Law of Large Numbers."
    },
    {
        title: "Volatility & Variance",
        icon: "📈",
        content: "Low Volatility = frequent small wins (good for wagering). High Volatility = rare massive wins (good for speculative play). Match the volatility to your bankroll size."
    },
    {
        title: "The Gambler's Fallacy",
        icon: "🧊",
        content: "A machine that hasn't paid in weeks is not 'due'. Every spin is an independent event. The odds of hitting a jackpot on spin #1 and spin #1000 are identical."
    },
    {
        title: "Bankroll Management",
        icon: "🛡️",
        content: "Never bet more than 1% of your bankroll on a single spin. If you have $100, spin at $1. This gives you statistical runway to survive variance."
    },
    {
        title: "RTP vs. Hit Frequency",
        icon: "🎯",
        content: "RTP is how much is paid back over time (e.g., 96%). Hit Frequency is how often you win (e.g., 20%). A high RTP slot can still have a low Hit Frequency, meaning long losing streaks are possible."
    },
    {
        title: "Bonus EV (Expected Value)",
        icon: "🧮",
        content: "Don't look at the bonus size; look at the math. A $100 bonus with 50x wagering is often worse than a $20 bonus with 1x wagering. Always calculate the cost to clear."
    },
    {
        title: "The RNG Reality",
        icon: "⚙️",
        content: "The Random Number Generator never stops. It cycles millions of times per second. The millisecond you click 'Spin' determines the result. There are no 'hot' or 'cold' cycles, only random clusters."
    },
    {
        title: "Responsible Exits",
        icon: "🛑",
        content: "Set a 'Stop Loss' and a 'Win Limit' before you open the app. If you double your money, withdraw. If you lose your budget, quit. Discipline is the only way to protect your bankroll."
    }
];

// --- 4. MATH SLIDES ---
const MATH_SLIDES = [
    {
        title: "Win Distribution: The Log-Normal Curve",
        subtitle: "Why 'Average' Return is a Lie",
        visual: "log-normal", 
        content: "The 'Mean' (RTP of 96%) is heavily skewed by rare jackpots. The 'Median' outcome for a typical session is actually a loss. Most players sit in the 'hump' of the curve (losing small amounts), while one lucky player hits the 'long tail' (the jackpot). If you don't hit the tail, your personal RTP is likely closer to 60%."
    },
    {
        title: "Bet Equity (EV) Calculation",
        subtitle: "Is the Bonus Mathematically Profitable?",
        visual: "formula-ev",
        content: "EV = Bonus - (Wager × House Edge). Example: A $100 bonus with 20x wagering ($2000 bets) on a 96% RTP slot (4% Edge). Cost = $2000 × 0.04 = $80. EV = $100 - $80 = +$20. Positive EV means the player has the mathematical advantage."
    },
    {
        title: "Standard Deviation (σ)",
        subtitle: "Measuring the Swing",
        visual: "sigma",
        content: "Standard Deviation measures how wild the swings will be. A slot with high SD (like Megaways) requires 300x your bet size to have a <1% 'Risk of Ruin'. A low SD slot (like Starburst) only requires 100x."
    },
    {
        title: "House Edge Mechanics",
        subtitle: "The Built-In Tax",
        visual: "edge",
        content: "House Edge is 100% - RTP. In Roulette, the '0' creates the edge (2.7%). In Slots, the 'par sheet' weighting determines it. It is an immutable tax on every dollar wagered over infinity."
    }
];

module.exports = { WEEKLY_SCHEDULE, SLOTS_DATA, PAYMENTS_DB, SKILL_ARTICLES, MATH_SLIDES };

