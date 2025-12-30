const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// --- 1. CASINO DATABASE (VERIFIED LINKS) ---
const CASINO_DB = [
  { 
      id: "playojo", 
      name: "PlayOJO", 
      logo_file: "playojo.png", 
      affiliate_link: "https://www.playojo.ca", 
      sign_up_bonus: "50 FREE SPINS", 
      bonus_detail: "No Wagering Requirements",
      bonus_type: "no_wager",
      wagering_req: "0x", 
      min_deposit: "$10",
      metrics: { speed: "Instant", rtp: "97.0%" }, 
      hero_badge: "Fair Play" 
  },
  { 
      id: "jackpotcity", 
      name: "JackpotCity", 
      logo_file: "jackpotcity.png", 
      affiliate_link: "https://www.jackpotcity.ca", 
      sign_up_bonus: "$1,600 BONUS", 
      bonus_detail: "Deposit Match Package",
      bonus_type: "match", 
      wagering_req: "70x",
      min_deposit: "$10",
      metrics: { speed: "24h", rtp: "97.8%" }, 
      hero_badge: "High Roller" 
  },
  { 
      id: "betmgm", 
      name: "BetMGM", 
      logo_file: "betmgm.png", 
      affiliate_link: "https://www.betmgm.com", 
      sign_up_bonus: "$3,000 MATCH", 
      bonus_detail: "+ $100 On The House",
      bonus_type: "match", 
      wagering_req: "15x",
      min_deposit: "$20",
      metrics: { speed: "24h", rtp: "96.1%" }, 
      hero_badge: "Top Pick" 
  },
  { 
      id: "spin-casino", 
      name: "Spin Casino", 
      logo_file: "spin.png", 
      affiliate_link: "https://www.spincasino.ca", 
      sign_up_bonus: "$1,000 BONUS", 
      bonus_detail: "Deposit Match",
      bonus_type: "match", 
      wagering_req: "70x",
      min_deposit: "$10",
      metrics: { speed: "48h", rtp: "96.3%" }, 
      hero_badge: "Jackpots" 
  },
  { 
      id: "betrivers", 
      name: "BetRivers", 
      logo_file: "betrivers.png", 
      affiliate_link: "https://on.betrivers.ca", 
      sign_up_bonus: "$500 LOSSBACK", 
      bonus_detail: "First 24 Hours",
      bonus_type: "lossback", 
      wagering_req: "1x",
      min_deposit: "$10",
      metrics: { speed: "1h", rtp: "95.5%" }, 
      hero_badge: "Fast Pay" 
  },
  { 
      id: "northstar", 
      name: "NorthStar", 
      logo_file: "northstar.jpg", 
      affiliate_link: "https://www.northstarbets.ca", 
      sign_up_bonus: "$100 BET MATCH", 
      bonus_detail: "Wager $100 Get $100",
      bonus_type: "match", 
      wagering_req: "20x",
      min_deposit: "$10",
      metrics: { speed: "24h", rtp: "97.1%" }, 
      hero_badge: "Ontario Native" 
  }
];

// --- 2. SLOT GAMES ---
const SLOTS_DB = [
    { name: "Big Bass Bonanza", provider: "Pragmatic", img: "bigbass jpeg", rtp: "96.7%" },
    { name: "Starburst", provider: "NetEnt", img: "https://placehold.co/150x150/2d0036/FFF?text=Starburst", rtp: "96.1%" },
    { name: "Book of Dead", provider: "Play'n GO", img: "https://placehold.co/150x150/362d00/FFF?text=Book+Dead", rtp: "96.2%" },
    { name: "Sweet Bonanza", provider: "Pragmatic", img: "https://placehold.co/150x150/36002d/FFF?text=Sweet", rtp: "96.5%" },
    { name: "Wolf Gold", provider: "Pragmatic", img: "https://placehold.co/150x150/000/FFF?text=Wolf", rtp: "96.0%" }
];

// --- 3. PAYMENTS ---
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

// --- API ---
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
        payments: PAYMENTS_DB
    });
});

// --- LINK REDIRECTION ---
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

