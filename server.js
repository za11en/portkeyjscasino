const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// --- VERIFIED ONTARIO DATA (2025) ---
const CASINO_DB = [
  // TIER 1: The "Big 5" (Best for Logos)
  { id: "playojo", name: "PlayOJO", domain: "playojo.com", affiliate_link: "https://www.playojo.ca", sign_up_bonus: "50 Free Spins (No Wager)", bonus_type: "no_wager", metrics: { speed: 0, rtp: 97.0 }, hero_badge: "Fair Play" },
  { id: "betmgm", name: "BetMGM", domain: "betmgm.com", affiliate_link: "https://www.betmgm.com", sign_up_bonus: "100% Match up to $3,000", bonus_type: "match", metrics: { speed: 24, rtp: 96.1 }, hero_badge: "Top Pick" },
  { id: "jackpotcity", name: "JackpotCity", domain: "jackpotcity.com", affiliate_link: "https://www.jackpotcity.ca", sign_up_bonus: "$1,600 Bonus Pack", bonus_type: "match", metrics: { speed: 48, rtp: 97.8 }, hero_badge: "High Roller" },
  { id: "spin-casino", name: "Spin Casino", domain: "spincasino.com", affiliate_link: "https://www.spincasino.ca", sign_up_bonus: "$1,000 Deposit Bonus", bonus_type: "match", metrics: { speed: 48, rtp: 96.3 }, hero_badge: "Jackpots" },
  { id: "caesars", name: "Caesars", domain: "caesars.com", affiliate_link: "https://www.caesarspalaceonline.com", sign_up_bonus: "$10 Free + $1,000 Match", bonus_type: "match", metrics: { speed: 12, rtp: 95.8 }, hero_badge: "Vegas Style" },
  
  // TIER 2: Fan Favorites
  { id: "betrivers", name: "BetRivers", domain: "betrivers.com", affiliate_link: "https://on.betrivers.ca", sign_up_bonus: "100% Lossback up to $500", bonus_type: "lossback", metrics: { speed: 1, rtp: 95.5 }, hero_badge: "Instant Pay" },
  { id: "888", name: "888 Casino", domain: "888casino.com", affiliate_link: "https://www.888casino.ca", sign_up_bonus: "88 Free Spins (No Dep)", bonus_type: "spins", metrics: { speed: 72, rtp: 96.6 }, hero_badge: "No Deposit" },
  { id: "leovegas", name: "LeoVegas", domain: "leovegas.com", affiliate_link: "https://www.leovegas.com", sign_up_bonus: "$1,500 + 100 Spins", bonus_type: "match", metrics: { speed: 24, rtp: 96.5 }, hero_badge: "Mobile King" },
  { id: "draftkings", name: "DraftKings", domain: "draftkings.com", affiliate_link: "https://casino.draftkings.com", sign_up_bonus: "$100 Casino Credits", bonus_type: "no_wager", metrics: { speed: 1, rtp: 96.0 }, hero_badge: "Top App" },
  { id: "northstar", name: "NorthStar", domain: "northstarbets.ca", affiliate_link: "https://www.northstarbets.ca", sign_up_bonus: "$100 Bet Match", bonus_type: "match", metrics: { speed: 24, rtp: 97.1 }, hero_badge: "Ontario Native" },

  // TIER 3: The "Rest"
  { id: "royal-panda", name: "Royal Panda", domain: "royalpanda.com", affiliate_link: "https://www.royalpanda.com", sign_up_bonus: "$1,000 Match", bonus_type: "match", metrics: { speed: 24, rtp: 96.2 }, hero_badge: "User Choice" },
  { id: "party", name: "PartyCasino", domain: "partycasino.com", affiliate_link: "https://casino.partycasino.com", sign_up_bonus: "100% up to $1,000", bonus_type: "match", metrics: { speed: 48, rtp: 96.0 }, hero_badge: "Trusted" },
  { id: "pokerstars", name: "PokerStars", domain: "pokerstars.com", affiliate_link: "https://www.pokerstars.ca", sign_up_bonus: "100% up to $600", bonus_type: "match", metrics: { speed: 48, rtp: 96.0 }, hero_badge: "Poker Pro" },
  { id: "casumo", name: "Casumo", domain: "casumo.com", affiliate_link: "https://www.casumo.com", sign_up_bonus: "$500 + 75 Spins", bonus_type: "match", metrics: { speed: 24, rtp: 97.2 }, hero_badge: "Adventure" },
  { id: "comeon", name: "ComeOn!", domain: "comeon.com", affiliate_link: "https://www.comeon.com", sign_up_bonus: "150% Bonus", bonus_type: "match", metrics: { speed: 24, rtp: 96.0 }, hero_badge: "Big Bonus" }
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

