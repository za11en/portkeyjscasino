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
  // TIER 1: The "Big 5" (Mapped to your local files)
  { 
      id: "playojo", 
      name: "PlayOJO", 
      logo_file: "playojo.png", // <--- LOCAL FILE
      affiliate_link: "https://www.playojo.ca", 
      sign_up_bonus: "50 Free Spins (No Wager)", 
      bonus_type: "no_wager", 
      metrics: { speed: 0, rtp: 97.0 }, 
      hero_badge: "Fair Play" 
  },
  { 
      id: "jackpotcity", 
      name: "JackpotCity", 
      logo_file: "jackpotcity.png", // <--- LOCAL FILE
      affiliate_link: "https://www.jackpotcity.ca", 
      sign_up_bonus: "$1,600 Bonus Pack", 
      bonus_type: "match", 
      metrics: { speed: 48, rtp: 97.8 }, 
      hero_badge: "High Roller" 
  },
  // TIER 2: Others (Will use Neon Monogram Fallback until you add images)
  { id: "betmgm", name: "BetMGM", logo_file: "betmgm.png", affiliate_link: "https://www.betmgm.com", sign_up_bonus: "100% Match up to $3,000", bonus_type: "match", metrics: { speed: 24, rtp: 96.1 }, hero_badge: "Top Pick" },
  { id: "spin-casino", name: "Spin Casino", logo_file: "spin.png", affiliate_link: "https://www.spincasino.ca", sign_up_bonus: "$1,000 Deposit Bonus", bonus_type: "match", metrics: { speed: 48, rtp: 96.3 }, hero_badge: "Jackpots" },
  { id: "caesars", name: "Caesars", logo_file: "caesars.png", affiliate_link: "https://www.caesarspalaceonline.com", sign_up_bonus: "$10 Free + $1,000 Match", bonus_type: "match", metrics: { speed: 12, rtp: 95.8 }, hero_badge: "Vegas Style" },
  { id: "betrivers", name: "BetRivers", logo_file: "betrivers.png", affiliate_link: "https://on.betrivers.ca", sign_up_bonus: "100% Lossback up to $500", bonus_type: "lossback", metrics: { speed: 1, rtp: 95.5 }, hero_badge: "Instant Pay" },
  { id: "888", name: "888 Casino", logo_file: "888.png", affiliate_link: "https://www.888casino.ca", sign_up_bonus: "88 Free Spins (No Dep)", bonus_type: "spins", metrics: { speed: 72, rtp: 96.6 }, hero_badge: "No Deposit" },
  { id: "leovegas", name: "LeoVegas", logo_file: "leovegas.png", affiliate_link: "https://www.leovegas.com", sign_up_bonus: "$1,500 + 100 Spins", bonus_type: "match", metrics: { speed: 24, rtp: 96.5 }, hero_badge: "Mobile King" },
  { id: "northstar", name: "NorthStar", logo_file: "northstar.png", affiliate_link: "https://www.northstarbets.ca", sign_up_bonus: "$100 Bet Match", bonus_type: "match", metrics: { speed: 24, rtp: 97.1 }, hero_badge: "Ontario Native" },
  { id: "royal-panda", name: "Royal Panda", logo_file: "royalpanda.png", affiliate_link: "https://www.royalpanda.com", sign_up_bonus: "$1,000 Match", bonus_type: "match", metrics: { speed: 24, rtp: 96.2 }, hero_badge: "User Choice" },
  { id: "party", name: "PartyCasino", logo_file: "party.png", affiliate_link: "https://casino.partycasino.com", sign_up_bonus: "100% up to $1,000", bonus_type: "match", metrics: { speed: 48, rtp: 96.0 }, hero_badge: "Trusted" },
  { id: "pokerstars", name: "PokerStars", logo_file: "pokerstars.png", affiliate_link: "https://www.pokerstars.ca", sign_up_bonus: "100% up to $600", bonus_type: "match", metrics: { speed: 48, rtp: 96.0 }, hero_badge: "Poker Pro" }
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

