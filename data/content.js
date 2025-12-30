// --- 1. DAILY DROPS SCHEDULE (For the "Swipe" Feature) ---
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

// --- 2. EXPANDED SLOTS DB (Categorized) ---
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

// --- 3. EDUCATIONAL CONTENT (Skill Edge) ---
const SKILL_ARTICLES = [
    {
        title: "The Law of Large Numbers (LLN)",
        icon: "📊",
        content: "Many players misunderstand 'luck' versus 'probability'. The Law of Large Numbers states that as the number of trials (spins) increases, the actual results will converge on the theoretical expected value (RTP). In a short session of 100 spins, anything can happen—you might be up 500% or down 100%. However, over 1,000,000 spins, if a slot has an RTP of 96%, you will almost certainly have retained exactly 96% of your wagers. This is why the casino always wins in the long run, and why 'hot streaks' are statistically temporary anomalies."
    },
    {
        title: "Volatility & Variance Distribution",
        icon: "📈",
        content: "RTP tells you 'how much' gets paid back, but Volatility tells you 'how' it gets paid. A Low Volatility game (like Starburst) produces a Win Distribution Curve that is tall and narrow—results are clustered tightly around small losses and small wins. A High Volatility game (like Bonanza) has a flat, wide curve with 'fat tails'. This means you are statistically more likely to bust your bankroll quickly, but also significantly more likely to hit a 1000x win. Smart players match volatility to their bankroll: use Low Volatility to clear wagering requirements, and High Volatility for speculative play."
    },
    {
        title: "Debunking the 'Hot' and 'Cold' Myth",
        icon: "🧊",
        content: "This is the 'Gambler's Fallacy'. If a slot hasn't paid a jackpot in weeks, it is NOT 'due' to hit. Every spin is an Independent Event determined by a Random Number Generator (RNG) seeding a new result every millisecond. The odds of hitting a jackpot on spin #1 and spin #1,000,000 are identical. Seeing a 'Cold' machine is basically pattern recognition bias; the machine has no memory of previous spins."
    },
    {
        title: "Understanding Wagering Requirements (EV)",
        icon: "🧮",
        content: "To calculate if a bonus is mathematically profitable, you must calculate the Expected Value (EV). Formula: EV = Bonus Amount - (Wager Requirement × House Edge). Example: A $100 bonus with 20x wagering ($2000 total bets) on a 96% RTP slot (4% House Edge). Cost to clear = $2000 × 0.04 = $80. Your EV is $100 - $80 = +$20. If the wagering was 30x, cost to clear is $120, making the EV -$20. Never take a bonus with negative EV unless you are playing purely for entertainment."
    },
    {
        title: "Bankroll Management: The 1% Rule",
        icon: "🛡️",
        content: "Professional players use the 'Risk of Ruin' concept. To have a <1% chance of going bust during a bad variance streak, your bet size should never exceed 1% of your total bankroll. For High Volatility slots, this should be 0.5%. If you have $100, you should be spinning at $0.50 to $1.00 max. Betting $5.00 on a $100 bankroll gives you a nearly 90% statistical probability of hitting $0 before hitting a bonus round."
    }
];

module.exports = { WEEKLY_SCHEDULE, SLOTS_DATA, PAYMENTS_DB, SKILL_ARTICLES };

