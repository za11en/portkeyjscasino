const DAILY_DROPS = [
    { casino: "PlayOJO", offer: "Kick of the Day: Free Spin (No Wager)" },
    { casino: "JackpotCity", offer: "Bonus Wheel: Up to $50 Credits" },
    { casino: "BetMGM", offer: "Lion's Share: Daily Drop Jackpot" },
    { casino: "BetRivers", offer: "Daily Rush: $10 Bonus Money" },
    { casino: "888 Casino", offer: "Daily Wish: Free Spins" }
];

const SLOTS_DB = [
    { name: "Big Bass Bonanza", provider: "Pragmatic", img: "bigbass.jpeg", rtp: "96.7%" },
    { name: "Starburst", provider: "NetEnt", img: "starburst.jpeg", rtp: "96.1%" },
    { name: "Book of Dead", provider: "Play'n GO", img: "dead.jpeg", rtp: "96.2%" },
    { name: "Sweet Bonanza", provider: "Pragmatic", img: "sweet.jpeg", rtp: "96.5%" },
    { name: "Wolf Gold", provider: "Pragmatic", img: "wolf.jpeg", rtp: "96.0%" },
    { name: "9 Masks of Fire", provider: "Microgaming", img: "masks.jpeg", rtp: "96.2%" },
    { name: "Cleopatra", provider: "IGT", img: "cleopatra.jpeg", rtp: "95.0%" }
];

const PAYMENTS_DB = [
    { name: "Interac", type: "Debit", time: "Instant" },
    { name: "Visa", type: "Card", time: "Instant" },
    { name: "MasterCard", type: "Card", time: "Instant" },
    { name: "PayPal", type: "E-Wallet", time: "24h" },
    { name: "Apple Pay", type: "Mobile", time: "Instant" }
];

module.exports = { DAILY_DROPS, SLOTS_DB, PAYMENTS_DB };
