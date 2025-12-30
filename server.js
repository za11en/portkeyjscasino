const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CRITICAL FIX FOR VERCEL ---
app.set('trust proxy', 1); 

// --- CONFIGURATION ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(requestIp.mw());

// --- SECURITY ---
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "unpkg.com", "cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  })
);

// --- THE "IMMUTABLE" DATABASE ---
// No more file reading errors. The data is now part of the code.
const CASINO_DB = [
  {
    "id": "betmgm-on",
    "name": "BetMGM Ontario",
    "affiliate_link": "https://www.betmgm.com",
    "logo_initials": "BM",
    "legal_license": "OPIG1234567",
    "metrics": {
      "payout_speed_hours": 24,
      "rtp_avg": 96.5,
      "game_count": 850,
      "live_dealer_tables": 45
    },
    "tags": ["Fast Payout", "High Roller"],
    "hero_badge": "Best for Poker"
  },
  {
    "id": "thescore-bet",
    "name": "theScore Bet",
    "affiliate_link": "https://thescore.bet",
    "logo_initials": "SB",
    "legal_license": "OPIG9876543",
    "metrics": {
      "payout_speed_hours": 12,
      "rtp_avg": 95.8,
      "game_count": 400,
      "live_dealer_tables": 10
    },
    "tags": ["Mobile First", "Sports"],
    "hero_badge": "Top App UI"
  },
  {
    "id": "northstar-bets",
    "name": "NorthStar Bets",
    "affiliate_link": "https://northstarbets.ca",
    "logo_initials": "NS",
    "legal_license": "OPIG5551212",
    "metrics": {
      "payout_speed_hours": 48,
      "rtp_avg": 97.1,
      "game_count": 1200,
      "live_dealer_tables": 60
    },
    "tags": ["Huge Library", "Ontario Native"],
    "hero_badge": "Most Games"
  }
];

const loadCasinos = () => {
    return CASINO_DB;
};

// --- MIDDLEWARE: GEO-COMPLIANCE ---
const checkOntario = (req, res, next) => {
  // 1. GOD MODE (Bypass)
  if (req.query.dev === 'true') return next();

  // 2. VERCEL CHECK
  const vercelCountry = req.headers['x-vercel-ip-country'];
  const vercelRegion = req.headers['x-vercel-ip-country-region'];
  
  if (vercelCountry) {
      if (vercelCountry === 'CA' && vercelRegion === 'ON') return next();
      return res.status(403).send(`<h1>Region Restricted (Vercel)</h1><p>Detected: ${vercelRegion}, ${vercelCountry}</p>`);
  }

  // 3. FALLBACK IP CHECK
  const ip = req.clientIp;
  if (ip === '::1' || ip === '127.0.0.1' || req.hostname === 'localhost') return next();

  const geo = geoip.lookup(ip);
  if (geo && geo.region !== 'ON' && geo.country === 'CA') {
     return res.status(403).send(`<h1>Region Restricted</h1><p>Detected: ${geo.region}</p>`);
  }
  if (geo && geo.country !== 'CA') {
     return res.status(403).send('<h1>Access Denied</h1><p>Not available in your country.</p>');
  }

  next();
};

// --- ROUTES ---

app.get('/', checkOntario, (req, res) => {
  res.render('dashboard', { 
    casinos: JSON.stringify(loadCasinos())
  });
});

app.get('/go/:id', (req, res) => {
  const target = loadCasinos().find(c => c.id === req.params.id);
  if (target) {
    res.redirect(target.affiliate_link);
  } else {
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`Portkey Server is running on port ${PORT}`);
});

