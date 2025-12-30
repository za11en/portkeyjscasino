const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// --- 1. CASINO DATABASE (Updated with Min Dep & Wager) ---
const CASINO_DB = [
  { 
      id: "playojo", 
      name: "PlayOJO", 
      logo_file: "playojo.png", 
      affiliate_link: "https://www.playojo.ca", 
      sign_up_bonus: "50 Free Spins", 
      bonus_type: "no_wager",
      wagering_req: "0x (None)", 
      min_deposit: "$10",
      metrics: { speed: 0, rtp: 97.0 }, 
      hero_badge: "Fair Play" 
  },
  { 
      id: "jackpotcity", 
      name: "JackpotCity", 
      logo_file: "jackpotcity.png", 
      affiliate_link: "https://www.jackpotcity.ca", 
      sign_up_bonus: "$1,600 Pack", 
      bonus_type: "match", 
      wagering_req: "70x",
      min_deposit: "$10",
      metrics: { speed: 48, rtp: 97.8 }, 
      hero_badge: "High Roller" 
  },
  { 
      id: "betmgm", 
      name: "BetMGM", 
      logo_file: "betmgm.png", 
      affiliate_link: "https://www.betmgm.com", 
      sign_up_bonus: "100% up to $3K", 
      bonus_type: "match", 
      wagering_req: "15x",
      min_deposit: "$20",
      metrics: { speed: 24, rtp: 96.1 }, 
      hero_badge: "Top Pick" 
  },
  { 
      id: "spin-casino", 
      name: "Spin Casino", 
      logo_file: "spin.png", 
      affiliate_link: "https://www.spincasino.ca", 
      sign_up_bonus: "$1,000 Bonus", 
      bonus_type: "match", 
      wagering_req: "70x",
      min_deposit: "$10",
      metrics: { speed: 48, rtp: 96.3 }, 
      hero_badge: "Jackpots" 
  },
  { 
      id: "betrivers", 
      name: "BetRivers", 
      logo_file: "betrivers.png", 
      affiliate_link: "https://on.betrivers.ca", 
      sign_up_bonus: "$500 Lossback", 
      bonus_type: "lossback", 
      wagering_req: "1x",
      min_deposit: "$10",
      metrics: { speed: 1, rtp: 95.5 }, 
      hero_badge: "Instant Pay" 
  },
  { 
      id: "888", 
      name: "888 Casino", 
      logo_file: "888.png", 
      affiliate_link: "https://www.888casino.ca", 
      sign_up_bonus: "88 Free Spins", 
      bonus_type: "spins", 
      wagering_req: "30x",
      min_deposit: "$20",
      metrics: { speed: 72, rtp: 96.6 }, 
      hero_badge: "No Deposit" 
  },
  { 
      id: "northstar", 
      name: "NorthStar", 
      logo_file: "northstar.png", 
      affiliate_link: "https://www.northstarbets.ca", 
      sign_up_bonus: "$100 Bet Match", 
      bonus_type: "match", 
      wagering_req: "20x",
      min_deposit: "$10",
      metrics: { speed: 24, rtp: 97.1 }, 
      hero_badge: "Ontario Native" 
  },
  { 
      id: "leovegas", 
      name: "LeoVegas", 
      logo_file: "leovegas.png", 
      affiliate_link: "https://www.leovegas.com", 
      sign_up_bonus: "$1.5K + 100 Spins", 
      bonus_type: "match", 
      wagering_req: "20x",
      min_deposit: "$10",
      metrics: { speed: 24, rtp: 96.5 }, 
      hero_badge: "Mobile King" 
  }
];

// --- 2. SLOT GAMES DATABASE ---
const SLOTS_DB = [
    { name: "Big Bass Bonanza", provider: "Pragmatic Play", img: "bigbass.jpg", rtp: "96.7%" },
    { name: "Starburst", provider: "NetEnt", img: "starburst.jpg", rtp: "96.1%" },
    { name: "Book of Dead", provider: "Play'n GO", img: "bookofdead.jpg", rtp: "96.2%" },
    { name: "Sweet Bonanza", provider: "Pragmatic Play", img: "sweetbonanza.jpg", rtp: "96.5%" },
    { name: "Wolf Gold", provider: "Pragmatic Play", img: "wolfgold.jpg", rtp: "96.0%" },
    { name: "9 Masks of Fire", provider: "Microgaming", img: "9masks.jpg", rtp: "96.2%" }
];

// --- 3. PAYMENT METHODS DATABASE ---
const PAYMENTS_DB = [
    { name: "Interac", type: "Debit", time: "Instant", icon: "interac-logo.png" },
    { name: "Visa / MC", type: "Credit", time: "Instant", icon: "visa-logo.png" },
    { name: "PayPal", type: "E-Wallet", time: "1-24 Hours", icon: "paypal-logo.png" },
    { name: "Apple Pay", type: "Mobile", time: "Instant", icon: "applepay-logo.png" }
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

// --- API ENDPOINTS ---

// Check Region
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

// Unified Data Endpoint
app.get('/api/data', checkOntarioAPI, (req, res) => {
    res.json({
        casinos: CASINO_DB,
        slots: SLOTS_DB,
        payments: PAYMENTS_DB
    });
});

app.get('/go/:id', (req, res) => {
    const target = CASINO_DB.find(c => c.id === req.params.id);
    target ? res.redirect(target.affiliate_link) : res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

