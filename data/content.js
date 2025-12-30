// --- 1. DAILY DROPS SCHEDULE ---
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

// --- 2. SLOTS DB ---
const SLOTS_DATA = {
    trending: [
        { name: "Big Bass Bonanza", provider: "Pragmatic", img: "bigbass.jpeg", rtp: "96.7%", vol: "High" },
        { name: "Starburst", provider: "NetEnt", img: "starburst.jpeg", rtp: "96.1%", vol: "Low" },
        { name: "Book of Dead", provider: "Play'n GO", img: "dead.jpeg", rtp: "96.2%", vol: "High" },
        { name: "Sweet Bonanza", provider: "Pragmatic", img: "sweet.jpeg", rtp: "96.5%", vol: "Med" },
        { name: "Wolf Gold", provider: "Pragmatic", img: "wolf.jpeg", rtp: "96.0%", vol: "Med" },
        { name: "9 Masks of Fire", provider: "Microgaming", img: "masks.jpeg", rtp: "96.2%", vol: "Med" },
        { name: "Cleopatra", provider: "IGT", img: "cleopatra.jpeg", rtp: "95.0%", vol: "Med" }
    ],
    high_rtp: [
        { name: "Blood Suckers", provider: "NetEnt", img: "blood.jpeg", rtp: "98.0%", vol: "Low" },
        { name: "White Rabbit", provider: "Big Time", img: "rabbit.jpeg", rtp: "97.7%", vol: "High" },
        { name: "Medusa Megaways", provider: "NextGen", img: "medusa.jpeg", rtp: "97.6%", vol: "High" },
        { name: "Guns N' Roses", provider: "NetEnt", img: "gnr.jpeg", rtp: "96.9%", vol: "Low" },
        { name: "Dead or Alive 2", provider: "NetEnt", img: "doa2.jpeg", rtp: "96.8%", vol: "High" },
        { name: "Immortal Romance", provider: "Microgaming", img: "immortal.jpeg", rtp: "96.8%", vol: "High" },
        { name: "Thunderstruck II", provider: "Microgaming", img: "thunder.jpeg", rtp: "96.6%", vol: "Med" }
    ],
    jackpots: [
        { name: "Mega Moolah", provider: "Microgaming", img: "moolah.jpeg", rtp: "88.1%", vol: "High" },
        { name: "Divine Fortune", provider: "NetEnt", img: "divine.jpeg", rtp: "96.6%", vol: "Med" },
        { name: "Age of the Gods", provider: "Playtech", img: "gods.jpeg", rtp: "95.0%", vol: "High" },
        { name: "Jackpot Giant", provider: "Playtech", img: "giant.jpeg", rtp: "94.2%", vol: "Med" },
        { name: "Hall of Gods", provider: "NetEnt", img: "hall.jpeg", rtp: "95.5%", vol: "Low" },
        { name: "Major Millions", provider: "Microgaming", img: "major.jpeg", rtp: "89.3%", vol: "High" },
        { name: "Wheel of Wishes", provider: "Alchemy", img: "wishes.jpeg", rtp: "93.3%", vol: "Low" }
    ]
};

const PAYMENTS_DB = [
    { name: "Interac", type: "Debit", time: "Instant" },
    { name: "Visa", type: "Card", time: "Instant" },
    { name: "MasterCard", type: "Card", time: "Instant" },
    { name: "PayPal", type: "E-Wallet", time: "24h" },
    { name: "Apple Pay", type: "Mobile", time: "Instant" }
];

// --- 3. GENERAL SKILL ARTICLES (Restored to Grid Format) ---
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
    }
];

// --- 4. NEW: MATH & PROBABILITY SLIDES (For the new slider section) ---
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

