const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

// --- VERCEL CONFIG ---
app.set('trust proxy', 1);

// --- HARDCODED DATABASE ---
const CASINO_DB = [
  {
    "id": "betmgm-on",
    "name": "BetMGM Ontario",
    "affiliate_link": "https://www.betmgm.com",
    "logo_initials": "BM",
    "legal_license": "OPIG1234567",
    "metrics": { "payout_speed_hours": 24, "rtp_avg": 96.5, "game_count": 850, "live_dealer_tables": 45 },
    "tags": ["Fast Payout", "High Roller"],
    "hero_badge": "Best for Poker"
  },
  {
    "id": "thescore-bet",
    "name": "theScore Bet",
    "affiliate_link": "https://thescore.bet",
    "logo_initials": "SB",
    "legal_license": "OPIG9876543",
    "metrics": { "payout_speed_hours": 12, "rtp_avg": 95.8, "game_count": 400, "live_dealer_tables": 10 },
    "tags": ["Mobile First", "Sports"],
    "hero_badge": "Top App UI"
  },
  {
    "id": "northstar-bets",
    "name": "NorthStar Bets",
    "affiliate_link": "https://northstarbets.ca",
    "logo_initials": "NS",
    "legal_license": "OPIG5551212",
    "metrics": { "payout_speed_hours": 48, "rtp_avg": 97.1, "game_count": 1200, "live_dealer_tables": 60 },
    "tags": ["Huge Library", "Ontario Native"],
    "hero_badge": "Most Games"
  }
];

// --- MIDDLEWARE ---
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(cookieParser());
app.use(requestIp.mw());
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "unpkg.com", "cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*"] // Allow API calls
    },
}));

// --- GEO CHECKER (Returns JSON now, doesn't render HTML) ---
const checkOntarioAPI = (req, res, next) => {
    // 1. GOD MODE
    if (req.query.dev === 'true' || req.headers.referer?.includes('dev=true')) return next();

    // 2. VERCEL CHECK
    const vercelRegion = req.headers['x-vercel-ip-country-region'];
    const vercelCountry = req.headers['x-vercel-ip-country'];
    if (vercelCountry === 'CA' && vercelRegion === 'ON') return next();

    // 3. FALLBACK IP
    const ip = req.clientIp;
    if (ip === '::1' || ip === '127.0.0.1' || req.hostname === 'localhost') return next();
    
    // If we fail, we don't crash, we just return a 403 JSON
    const geo = geoip.lookup(ip);
    if (geo && (geo.region !== 'ON' || geo.country !== 'CA')) {
        return res.status(403).json({ error: "RESTRICTED_REGION", region: geo.region });
    }
    next();
};

// --- ROUTES ---

// 1. SERVE THE APP (This always loads!)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. DATA API (Protected by Geo-Fence)
app.get('/api/casinos', checkOntarioAPI, (req, res) => {
    res.json(CASINO_DB);
});

// 3. REDIRECT
app.get('/go/:id', (req, res) => {
    const target = CASINO_DB.find(c => c.id === req.params.id);
    target ? res.redirect(target.affiliate_link) : res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

