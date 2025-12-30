const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// --- VERIFIED ONTARIO 40 (DEC 2025) ---
// Sources: AGCO Directory, iGaming Ontario, & Market Reports
const CASINO_DB = [
  // --- TIER 1: MARKET LEADERS ---
  { id: "betmgm", name: "BetMGM Casino", domain: "betmgm.com", affiliate_link: "https://www.betmgm.com", sign_up_bonus: "100% Match up to $3,000 + $100 Bonus", bonus_type: "match", metrics: { speed: 24, rtp: 96.16 }, hero_badge: "Market Leader" },
  { id: "caesars", name: "Caesars Palace", domain: "caesarspalaceonline.com", affiliate_link: "https://www.caesarspalaceonline.com", sign_up_bonus: "$10 Sign-Up + 100% Match up to $1,000", bonus_type: "match", metrics: { speed: 12, rtp: 95.8 }, hero_badge: "Best Loyalty" },
  { id: "draftkings", name: "DraftKings Casino", domain: "draftkings.com", affiliate_link: "https://casino.draftkings.com", sign_up_bonus: "Play $1, Get $100 in Casino Credits", bonus_type: "no_wager", metrics: { speed: 1, rtp: 96.0 }, hero_badge: "Instant Pay" },
  { id: "fanduel", name: "FanDuel Casino", domain: "fanduel.com", affiliate_link: "https://canada.casino.fanduel.com", sign_up_bonus: "100% Lossback up to $2,000 (24 Hours)", bonus_type: "lossback", metrics: { speed: 12, rtp: 96.2 }, hero_badge: "Top Rated App" },
  { id: "betrivers", name: "BetRivers", domain: "betrivers.ca", affiliate_link: "https://on.betrivers.ca", sign_up_bonus: "100% Lossback up to $500", bonus_type: "lossback", metrics: { speed: 2, rtp: 95.5 }, hero_badge: "1x Wager Req" },
  
  // --- TIER 2: SLOTS SPECIALISTS ---
  { id: "playojo", name: "PlayOJO", domain: "playojo.ca", affiliate_link: "https://www.playojo.ca", sign_up_bonus: "50 Free Spins (No Wagering)", bonus_type: "no_wager", metrics: { speed: 24, rtp: 97.0 }, hero_badge: "No Wager" },
  { id: "jackpotcity", name: "JackpotCity", domain: "jackpotcity.ca", affiliate_link: "https://www.jackpotcity.ca", sign_up_bonus: "$1,600 Deposit Bonus Package", bonus_type: "match", metrics: { speed: 48, rtp: 97.8 }, hero_badge: "High RTP" },
  { id: "spin-casino", name: "Spin Casino", domain: "spincasino.ca", affiliate_link: "https://www.spincasino.ca", sign_up_bonus: "$1,000 Deposit Bonus", bonus_type: "match", metrics: { speed: 48, rtp: 96.3 }, hero_badge: "Jackpots" },
  { id: "royal-vegas", name: "Royal Vegas", domain: "royalvegas.ca", affiliate_link: "https://www.royalvegas.ca", sign_up_bonus: "$1,200 Welcome Offer", bonus_type: "match", metrics: { speed: 48, rtp: 96.0 }, hero_badge: "Classic" },
  { id: "ruby-fortune", name: "Ruby Fortune", domain: "rubyfortune.ca", affiliate_link: "https://www.rubyfortune.ca", sign_up_bonus: "$750 Match Bonus", bonus_type: "match", metrics: { speed: 48, rtp: 96.5 }, hero_badge: "Premium" },

  // --- TIER 3: TECH & MOBILE FIRST ---
  { id: "thescore", name: "theScore Bet", domain: "thescore.bet", affiliate_link: "https://thescore.bet", sign_up_bonus: "Bet $10, Get $100 Bonus Bets", bonus_type: "spins", metrics: { speed: 6, rtp: 95.8 }, hero_badge: "Best UX" },
  { id: "leovegas", name: "LeoVegas", domain: "leovegas.com", affiliate_link: "https://www.leovegas.com", sign_up_bonus: "$1,500 Cash + 100 Spins", bonus_type: "match", metrics: { speed: 24, rtp: 96.5 }, hero_badge: "Mobile King" },
  { id: "northstar", name: "NorthStar Bets", domain: "northstarbets.ca", affiliate_link: "https://www.northstarbets.ca", sign_up_bonus: "$100 First Bet Match", bonus_type: "match", metrics: { speed: 24, rtp: 97.1 }, hero_badge: "Local Fav" },
  { id: "casumo", name: "Casumo", domain: "casumo.com", affiliate_link: "https://www.casumo.com/en-ca", sign_up_bonus: "100% up to $500 + 75 Spins", bonus_type: "match", metrics: { speed: 24, rtp: 97.2 }, hero_badge: "Adventure" },
  { id: "casino-days", name: "Casino Days", domain: "casinodays.com", affiliate_link: "https://casinodays.com/ca", sign_up_bonus: "100% up to $1,000 + 100 Spins", bonus_type: "match", metrics: { speed: 24, rtp: 96.8 }, hero_badge: "New Hotness" },

  // --- TIER 4: GLOBAL GIANTS ---
  { id: "bet365", name: "bet365 Casino", domain: "bet365.ca", affiliate_link: "https://casino.on.bet365.ca", sign_up_bonus: "$100 New Player Bonus", bonus_type: "match", metrics: { speed: 12, rtp: 96.4 }, hero_badge: "World Trusted" },
  { id: "888", name: "888 Casino", domain: "888casino.ca", affiliate_link: "https://www.888casino.ca", sign_up_bonus: "88 Free Spins (No Deposit)", bonus_type: "spins", metrics: { speed: 72, rtp: 96.6 }, hero_badge: "No Deposit" },
  { id: "pokerstars", name: "PokerStars", domain: "pokerstars.ca", affiliate_link: "https://www.pokerstars.ca", sign_up_bonus: "100% up to $600", bonus_type: "match", metrics: { speed: 48, rtp: 96.0 }, hero_badge: "Poker Pro" },
  { id: "party", name: "PartyCasino", domain: "partycasino.com", affiliate_link: "https://casino.partycasino.com", sign_up_bonus: "100% up to $1,000 + 50 Spins", bonus_type: "match", metrics: { speed: 48, rtp: 96.0 }, hero_badge: "Exclusive" },
  { id: "unibet", name: "Unibet", domain: "unibet.ca", affiliate_link: "https://on.unibet.ca", sign_up_bonus: "100% Deposit Match", bonus_type: "match", metrics: { speed: 24, rtp: 96.1 }, hero_badge: "Sports Hybrid" },

  // --- TIER 5: RISING STARS ---
  { id: "luckydays", name: "LuckyDays", domain: "luckydays.ca", affiliate_link: "https://luckydays.ca", sign_up_bonus: "$1,500 + 100 Spins", bonus_type: "match", metrics: { speed: 24, rtp: 96.5 }, hero_badge: "Rising Star" },
  { id: "comeon", name: "ComeOn!", domain: "comeon.com", affiliate_link: "https://www.comeon.com", sign_up_bonus: "150% up to $1,500", bonus_type: "match", metrics: { speed: 24, rtp: 96.0 }, hero_badge: "Big Bonus" },
  { id: "royal-panda", name: "Royal Panda", domain: "royalpanda.com", affiliate_link: "https://www.royalpanda.com", sign_up_bonus: "100% up to $1,000", bonus_type: "match", metrics: { speed: 24, rtp: 96.2 }, hero_badge: "User Choice" },
  { id: "betway", name: "Betway", domain: "betway.ca", affiliate_link: "https://betway.ca", sign_up_bonus: "100% up to $200", bonus_type: "match", metrics: { speed: 48, rtp: 95.8 }, hero_badge: "Established" },
  { id: "pointsbet", name: "PointsBet", domain: "pointsbet.ca", affiliate_link: "https://on.pointsbet.ca", sign_up_bonus: "$1,000 in Bonus Bets", bonus_type: "lossback", metrics: { speed: 12, rtp: 95.0 }, hero_badge: "Modern" },

  // --- TIER 6: NICHE & NEW ---
  { id: "bet99", name: "Bet99", domain: "bet99.ca", affiliate_link: "https://bet99.ca", sign_up_bonus: "$900 Casino Bonus", bonus_type: "match", metrics: { speed: 24, rtp: 96.0 }, hero_badge: "Canadian" },
  { id: "coolbet", name: "Coolbet", domain: "coolbet.ca", affiliate_link: "https://www.coolbet.ca", sign_up_bonus: "100% up to $200", bonus_type: "match", metrics: { speed: 24, rtp: 97.0 }, hero_badge: "Transparent" },
  { id: "firevegas", name: "FireVegas", domain: "firevegas.com", affiliate_link: "https://www.firevegas.com", sign_up_bonus: "Exclusive VIP Perks", bonus_type: "match", metrics: { speed: 24, rtp: 96.0 }, hero_badge: "VIP Focused" },
  { id: "gate777", name: "Gate777", domain: "gate777.com", affiliate_link: "https://www.gate777.com", sign_up_bonus: "$1,500 + 150 Spins", bonus_type: "match", metrics: { speed: 24, rtp: 96.5 }, hero_badge: "Travel Theme" },
  { id: "dreamvegas", name: "Dream Vegas", domain: "dreamvegas.com", affiliate_link: "https://www.dreamvegas.com", sign_up_bonus: "200% up to $2,500", bonus_type: "match", metrics: { speed: 48, rtp: 96.0 }, hero_badge: "Vegas Style" },

  // --- TIER 7: ESTABLISHED & RELIABLE ---
  { id: "olg", name: "OLG.ca", domain: "olg.ca", affiliate_link: "https://www.olg.ca", sign_up_bonus: "Official Gov Platform", bonus_type: "official", metrics: { speed: 48, rtp: 95.0 }, hero_badge: "Government" },
  { id: "bally", name: "Bally Bet", domain: "ballybet.ca", affiliate_link: "https://ballybet.ca", sign_up_bonus: "$100 Risk Free", bonus_type: "lossback", metrics: { speed: 48, rtp: 95.5 }, hero_badge: "Historic" },
  { id: "betvictor", name: "BetVictor", domain: "betvictor.com", affiliate_link: "https://www.betvictor.com/en-ca", sign_up_bonus: "100% Match", bonus_type: "match", metrics: { speed: 24, rtp: 96.2 }, hero_badge: "UK Giant" },
  { id: "rivalry", name: "Rivalry", domain: "rivalry.com", affiliate_link: "https://www.rivalry.com", sign_up_bonus: "100% up to $100", bonus_type: "match", metrics: { speed: 24, rtp: 95.0 }, hero_badge: "Esports" },
  { id: "sports-interaction", name: "Sports Interaction", domain: "sportsinteraction.com", affiliate_link: "https://www.sportsinteraction.com", sign_up_bonus: "125% up to $250", bonus_type: "match", metrics: { speed: 24, rtp: 96.0 }, hero_badge: "Canadian Og" },
  { id: "mrgreen", name: "Mr Green", domain: "mrgreen.com", affiliate_link: "https://www.mrgreen.com", sign_up_bonus: "$1,200 + 200 Spins", bonus_type: "match", metrics: { speed: 24, rtp: 96.5 }, hero_badge: "Gentleman" },
  { id: "slotsmagic", name: "SlotsMagic", domain: "slotsmagic.ca", affiliate_link: "https://www.slotsmagic.ca", sign_up_bonus: "$500 + 50 Spins", bonus_type: "match", metrics: { speed: 24, rtp: 96.0 }, hero_badge: "Slots Only" },
  { id: "fitzdares", name: "Fitzdares", domain: "fitzdares.ca", affiliate_link: "https://www.fitzdares.ca", sign_up_bonus: "Exclusive Club", bonus_type: "match", metrics: { speed: 48, rtp: 95.5 }, hero_badge: "Luxury" },
  { id: "neo", name: "Neo.bet", domain: "neo.bet", affiliate_link: "https://neo.bet/en-ca", sign_up_bonus: "Starter Bonus", bonus_type: "match", metrics: { speed: 12, rtp: 95.0 }, hero_badge: "Fast UI" },
  { id: "canplay", name: "CanPlay", domain: "canplaycasino.com", affiliate_link: "https://www.canplaycasino.com", sign_up_bonus: "10 Free Spins", bonus_type: "spins", metrics: { speed: 48, rtp: 95.0 }, hero_badge: "Niche" }
];

// --- STANDARD MIDDLEWARE ---
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

// --- GEO CHECKER (UNCHANGED) ---
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

app.get('/api/casinos', checkOntarioAPI, (req, res) => {
    res.json(CASINO_DB);
});

app.get('/go/:id', (req, res) => {
    const target = CASINO_DB.find(c => c.id === req.params.id);
    target ? res.redirect(target.affiliate_link) : res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

