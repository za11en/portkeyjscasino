
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// --- 1. THE "ONTARIO 40" DATABASE (UPDATED) ---
const CASINO_DB = [
  // --- TIER 1: THE GIANTS ---
  { 
    id: "playojo", name: "PlayOJO", logo_file: "playojo.png", affiliate_link: "https://www.playojo.ca", 
    sign_up_bonus: "50 FREE SPINS", bonus_detail: "No Wagering Ever", bonus_type: "no_wager", wagering_req: "0x", min_deposit: "$10", 
    metrics: { speed: "Instant", rtp: "97.0%" }, hero_badge: "Fair Play",
    daily_reward: "Kickers (Daily Mystery)", referral_bonus: null, loyalty_tier: "OJOplus (Cash back on every bet)"
  },
  { 
    id: "betrivers", name: "BetRivers", logo_file: "betrivers.svg", affiliate_link: "https://on.betrivers.ca", 
    sign_up_bonus: "$500 LOSSBACK", bonus_detail: "1x Wager Req", bonus_type: "lossback", wagering_req: "1x", min_deposit: "$10", 
    metrics: { speed: "1h", rtp: "95.5%" }, hero_badge: "Best Value",
    daily_reward: "Daily Rush Race", referral_bonus: "$50 For You, $50 For Them", loyalty_tier: "iRush Rewards"
  },
  { 
    id: "betmgm", name: "BetMGM", logo_file: "betmgm.png", affiliate_link: "https://www.betmgm.com", 
    sign_up_bonus: "$3,000 MATCH", bonus_detail: "+ $100 Free", bonus_type: "match", wagering_req: "15x", min_deposit: "$20", 
    metrics: { speed: "24h", rtp: "96.1%" }, hero_badge: "Top Pick",
    daily_reward: "Lion's Share Daily Drop", referral_bonus: "$100 Refer-a-Friend", loyalty_tier: "MGM Rewards (Vegas Comps)"
  },
  { 
    id: "jackpotcity", name: "JackpotCity", logo_file: "jackpotcity.png", affiliate_link: "https://www.jackpotcity.ca", 
    sign_up_bonus: "$1,600 PACK", bonus_detail: "Daily Wheel Spins", bonus_type: "match", wagering_req: "70x", min_deposit: "$10", 
    metrics: { speed: "24h", rtp: "97.8%" }, hero_badge: "High Roller",
    daily_reward: "Bonus Wheel Spin", referral_bonus: null, loyalty_tier: "Loyalty Points System"
  },
  { 
    id: "draftkings", name: "DraftKings", logo_file: "draftkings.png", affiliate_link: "https://casino.draftkings.com", 
    sign_up_bonus: "PLAY $1 GET $100", bonus_detail: "Casino Credits", bonus_type: "no_wager", wagering_req: "1x", min_deposit: "$5", 
    metrics: { speed: "Instant", rtp: "96.0%" }, hero_badge: "Low Dep",
    daily_reward: "Daily Missions", referral_bonus: "$100 Casino Credits", loyalty_tier: "Dynasty Rewards"
  },
  
  // --- TIER 2: LOCAL FAVORITES ---
  { 
    id: "northstar", name: "NorthStar", logo_file: "northstar.png", affiliate_link: "https://www.northstarbets.ca", 
    sign_up_bonus: "$100 BET MATCH", bonus_detail: "Ontario Exclusive", bonus_type: "match", wagering_req: "20x", min_deposit: "$10", 
    metrics: { speed: "24h", rtp: "97.1%" }, hero_badge: "Local",
    daily_reward: "Daily Bet Boosts", referral_bonus: null, loyalty_tier: "VIP Status"
  },
  { 
    id: "thescore", name: "theScore Bet", logo_file: "score.png", affiliate_link: "https://thescore.bet", 
    sign_up_bonus: "BET $10 GET $100", bonus_detail: "Bonus Bets", bonus_type: "spins", wagering_req: "1x", min_deposit: "$10", 
    metrics: { speed: "12h", rtp: "95.8%" }, hero_badge: "Best App",
    daily_reward: "Daily Parlay Boosts", referral_bonus: "$50 Bonus Bet", loyalty_tier: null
  },
  { 
    id: "caesars", name: "Caesars", logo_file: "caesars.png", affiliate_link: "https://www.caesarspalaceonline.com", 
    sign_up_bonus: "$1,000 MATCH", bonus_detail: "+ $10 Sign Up", bonus_type: "match", wagering_req: "15x", min_deposit: "$10", 
    metrics: { speed: "12h", rtp: "95.8%" }, hero_badge: "Vegas",
    daily_reward: "Daily Mystery Bonus", referral_bonus: "5,000 Reward Credits", loyalty_tier: "Caesars Rewards"
  },
  { 
    id: "leovegas", name: "LeoVegas", logo_file: "leo.png", affiliate_link: "https://www.leovegas.com", 
    sign_up_bonus: "$1,500 + 100 SPINS", bonus_detail: "Cash Reload", bonus_type: "match", wagering_req: "20x", min_deposit: "$10", 
    metrics: { speed: "24h", rtp: "96.5%" }, hero_badge: "Mobile",
    daily_reward: "Lunchtime Free Spins", referral_bonus: null, loyalty_tier: "LeoVegas VIP"
  },
  { 
    id: "888", name: "888 Casino", logo_file: "888.svg", affiliate_link: "https://www.888casino.ca", 
    sign_up_bonus: "88 FREE SPINS", bonus_detail: "No Deposit Req", bonus_type: "spins", wagering_req: "30x", min_deposit: "$20", 
    metrics: { speed: "48h", rtp: "96.6%" }, hero_badge: "Free",
    daily_reward: "The Daily Wish", referral_bonus: null, loyalty_tier: "888 VIP Club"
  },

  // --- TIER 3 & 4 (Selected Updates for brevity, rest keep defaults) ---
  { id: "spin-casino", name: "Spin Casino", logo_file: "spin.png", affiliate_link: "https://www.spincasino.ca", sign_up_bonus: "$1,000 MATCH", bonus_detail: "Slots Focus", bonus_type: "match", wagering_req: "70x", min_deposit: "$10", metrics: { speed: "48h", rtp: "96.3%" }, daily_reward: "Bonus Wheel", referral_bonus: null, loyalty_tier: "Loyalty Points" },
  { id: "royal-panda", name: "Royal Panda", logo_file: "royalpanda.png", affiliate_link: "https://www.royalpanda.com", sign_up_bonus: "$1,000 MATCH", bonus_detail: "100% Reload", bonus_type: "match", wagering_req: "35x", min_deposit: "$10", metrics: { speed: "24h", rtp: "96.2%" }, daily_reward: null, referral_bonus: null, loyalty_tier: "Loyalty Club" },
  { id: "casumo", name: "Casumo", logo_file: "casumo.png", affiliate_link: "https://www.casumo.com", sign_up_bonus: "$500 + 75 SPINS", bonus_detail: "9 Masks of Fire", bonus_type: "match", wagering_req: "30x", min_deposit: "$10", metrics: { speed: "24h", rtp: "97.2%" }, daily_reward: "Reel Races (Tournaments)", referral_bonus: null, loyalty_tier: "The Adventure" },
  { id: "party", name: "PartyCasino", logo_file: "party.png", affiliate_link: "https://casino.partycasino.com", sign_up_bonus: "$2,000 + 275 SPINS", bonus_detail: "Huge Package", bonus_type: "match", wagering_req: "30x", min_deposit: "$10", metrics: { speed: "48h", rtp: "96.0%" }, daily_reward: "Slot Tournaments", referral_bonus: null, loyalty_tier: "Cashback" },
  { id: "fanduel", name: "FanDuel", logo_file: "fanduel.png", affiliate_link: "https://canada.casino.fanduel.com", sign_up_bonus: "$2,000 LOSSBACK", bonus_detail: "Refund in Credits", bonus_type: "lossback", wagering_req: "1x", min_deposit: "$10", metrics: { speed: "12h", rtp: "96.2%" }, daily_reward: "Reward Machine (3 Free Spins)", referral_bonus: "$50 Bonus Each", loyalty_tier: "Players Club" },
  
  // Standard entries below (filling gaps with nulls for consistency if needed, but JS handles undefined fine)
  { id: "pointsbet", name: "PointsBet", logo_file: "pointsbet.png", affiliate_link: "https://on.pointsbet.ca", sign_up_bonus: "$1,000 LOSSBACK", bonus_detail: "Free Bets", bonus_type: "lossback", wagering_req: "1x", min_deposit: "$10", metrics: { speed: "12h", rtp: "95.0%" }, daily_reward: "Power Hour", referral_bonus: "$100 Free Bet", loyalty_tier: "Rewards" },
  { id: "betway", name: "Betway", logo_file: "betway.png", affiliate_link: "https://betway.ca", sign_up_bonus: "$200 MATCH", bonus_detail: "Established Brand", bonus_type: "match", wagering_req: "50x", min_deposit: "$10", metrics: { speed: "48h", rtp: "95.8%" } },
  { id: "comeon", name: "ComeOn!", logo_file: "comeon.png", affiliate_link: "https://www.comeon.com", sign_up_bonus: "150% MATCH", bonus_detail: "Up to $1500", bonus_type: "match", wagering_req: "35x", min_deposit: "$20", metrics: { speed: "24h", rtp: "96.0%" } },
  { id: "casino-days", name: "Casino Days", logo_file: "casinodays.png", affiliate_link: "https://casinodays.com", sign_up_bonus: "$1,000 + 100 SPINS", bonus_detail: "Book of Dead", bonus_type: "match", wagering_req: "35x", min_deposit: "$20", metrics: { speed: "24h", rtp: "96.8%" } },
  { id: "luckydays", name: "LuckyDays", logo_file: "luckydays.png", affiliate_link: "https://luckydays.ca", sign_up_bonus: "$1,500 PACKAGE", bonus_detail: "Three Deposits", bonus_type: "match", wagering_req: "30x", min_deposit: "$20", metrics: { speed: "24h", rtp: "96.5%" } },
  { id: "ruby-fortune", name: "Ruby Fortune", logo_file: "rubyfortune.png", affiliate_link: "https://www.rubyfortune.ca", sign_up_bonus: "$750 MATCH", bonus_detail: "Microgaming", bonus_type: "match", wagering_req: "70x", min_deposit: "$10", metrics: { speed: "48h", rtp: "96.5%" } },
  { id: "royal-vegas", name: "Royal Vegas", logo_file: "royalvegas.png", affiliate_link: "https://www.royalvegas.ca", sign_up_bonus: "$1,200 MATCH", bonus_detail: "Classic Theme", bonus_type: "match", wagering_req: "70x", min_deposit: "$10", metrics: { speed: "48h", rtp: "96.0%" } },
  { id: "gaming-club", name: "Gaming Club", logo_file: "gamingclub.png", affiliate_link: "https://www.gamingclub.com", sign_up_bonus: "$350 MATCH", bonus_detail: "Since 1994", bonus_type: "match", wagering_req: "70x", min_deposit: "$10", metrics: { speed: "48h", rtp: "95.5%" } },
  { id: "all-slots", name: "All Slots", logo_file: "allslots.png", affiliate_link: "https://www.allslotscasino.com", sign_up_bonus: "$1,500 MATCH", bonus_detail: "Slot Focus", bonus_type: "match", wagering_req: "70x", min_deposit: "$10", metrics: { speed: "48h", rtp: "96.0%" } },
  { id: "platinum", name: "Platinum Play", logo_file: "platinum.png", affiliate_link: "https://www.platinumplaycasino.com", sign_up_bonus: "$800 MATCH", bonus_detail: "VIP Vibes", bonus_type: "match", wagering_req: "70x", min_deposit: "$10", metrics: { speed: "48h", rtp: "96.0%" } },
  { id: "euro-palace", name: "Euro Palace", logo_file: "europalace.png", affiliate_link: "https://www.europalace.com", sign_up_bonus: "$600 MATCH", bonus_detail: "European Style", bonus_type: "match", wagering_req: "70x", min_deposit: "$10", metrics: { speed: "48h", rtp: "95.5%" } },
  { id: "zodiac", name: "Zodiac Casino", logo_file: "zodiac.png", affiliate_link: "https://www.zodiaccasino.com", sign_up_bonus: "80 CHANCES", bonus_detail: "For $1 Deposit", bonus_type: "spins", wagering_req: "200x", min_deposit: "$1", metrics: { speed: "48h", rtp: "96.0%" } },
  { id: "yukon", name: "Yukon Gold", logo_file: "yukon.png", affiliate_link: "https://www.yukongoldcasino.eu", sign_up_bonus: "125 CHANCES", bonus_detail: "For $10 Deposit", bonus_type: "spins", wagering_req: "200x", min_deposit: "$10", metrics: { speed: "48h", rtp: "96.0%" } },
  { id: "luxury", name: "Luxury Casino", logo_file: "luxury.png", affiliate_link: "https://www.luxurycasino.com", sign_up_bonus: "$1,000 MATCH", bonus_detail: "High Limits", bonus_type: "match", wagering_req: "200x", min_deposit: "$10", metrics: { speed: "48h", rtp: "96.0%" } },
  { id: "captain", name: "Captain Cooks", logo_file: "captain.png", affiliate_link: "https://www.captaincookscasino.eu", sign_up_bonus: "100 CHANCES", bonus_detail: "For $5 Deposit", bonus_type: "spins", wagering_req: "200x", min_deposit: "$5", metrics: { speed: "48h", rtp: "96.0%" } },
  { id: "mondial", name: "Grand Mondial", logo_file: "mondial.png", affiliate_link: "https://www.grandmondial.eu", sign_up_bonus: "150 CHANCES", bonus_detail: "Progressive", bonus_type: "spins", wagering_req: "200x", min_deposit: "$10", metrics: { speed: "48h", rtp: "96.0%" } },
  { id: "videoslots", name: "Videoslots", logo_file: "videoslots.png", affiliate_link: "https://www.videoslots.com", sign_up_bonus: "$200 MATCH", bonus_detail: "Most Games", bonus_type: "match", wagering_req: "35x", min_deposit: "$10", metrics: { speed: "24h", rtp: "96.5%" } },
  { id: "mrgreen", name: "Mr Green", logo_file: "mrgreen.png", affiliate_link: "https://www.mrgreen.com", sign_up_bonus: "$1,200 + 200 SPINS", bonus_detail: "Green Gaming", bonus_type: "match", wagering_req: "35x", min_deposit: "$20", metrics: { speed: "24h", rtp: "96.0%" } },
  { id: "unibet", name: "Unibet", logo_file: "unibet.png", affiliate_link: "https://on.unibet.ca", sign_up_bonus: "100% MATCH", bonus_detail: "Sports & Casino", bonus_type: "match", wagering_req: "25x", min_deposit: "$10", metrics: { speed: "24h", rtp: "96.5%" } },
  { id: "bally", name: "Bally Bet", logo_file: "bally.png", affiliate_link: "https://ballybet.ca", sign_up_bonus: "$100 RISK FREE", bonus_detail: "Lossback", bonus_type: "lossback", wagering_req: "1x", min_deposit: "$10", metrics: { speed: "48h", rtp: "95.5%" } },
  { id: "fitzdares", name: "Fitzdares", logo_file: "fitzdares.png", affiliate_link: "https://www.fitzdares.ca", sign_up_bonus: "EXCLUSIVE", bonus_detail: "Club Members", bonus_type: "match", wagering_req: "35x", min_deposit: "$50", metrics: { speed: "48h", rtp: "95.5%" } },
  { id: "neo", name: "Neo.bet", logo_file: "neo.png", affiliate_link: "https://neo.bet", sign_up_bonus: "STARTER BONUS", bonus_detail: "Fast UI", bonus_type: "match", wagering_req: "35x", min_deposit: "$10", metrics: { speed: "12h", rtp: "95.0%" } },
  { id: "rivalry", name: "Rivalry", logo_file: "rivalry.png", affiliate_link: "https://www.rivalry.com", sign_up_bonus: "$100 MATCH", bonus_detail: "Gen Z Focus", bonus_type: "match", wagering_req: "5x", min_deposit: "$15", metrics: { speed: "24h", rtp: "95.0%" } },
  { id: "sports-int", name: "Sports Interaction", logo_file: "sia.png", affiliate_link: "https://www.sportsinteraction.com", sign_up_bonus: "$250 MATCH", bonus_detail: "Canadian Org", bonus_type: "match", wagering_req: "30x", min_deposit: "$20", metrics: { speed: "24h", rtp: "96.0%" } }
];

// --- 2. DAILY DROPS (FOR TICKER) ---
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(requestIp.mw());
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "unpkg.com", "cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*"]
    },
}));

const checkOntarioAPI = (req, res, next) => {
    if (req.query.dev === 'true' || req.headers.referer?.includes('dev=true')) return next();
    const vercelRegion = req.headers['x-vercel-ip-country-region'];
    if (vercelRegion === 'ON') return next();
    const ip = req.clientIp;
    if (ip === '::1' || ip === '127.0.0.1' || req.hostname === 'localhost') return next();
    const geo = geoip.lookup(ip);
    if (geo && (geo.region !== 'ON' || geo.country !== 'CA')) {
        return res.status(403).json({ error: "RESTRICTED", region: geo ? geo.region : "Unknown" });
    }
    next();
};

app.get('/api/data', checkOntarioAPI, (req, res) => {
    res.json({
        casinos: CASINO_DB,
        slots: SLOTS_DB,
        payments: PAYMENTS_DB,
        daily_drops: DAILY_DROPS
    });
});

app.get('/go/:id', (req, res) => {
    const target = CASINO_DB.find(c => c.id === req.params.id);
    if (target) {
        res.redirect(target.affiliate_link);
    } else {
        res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
