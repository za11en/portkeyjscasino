const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CRITICAL FIX FOR VERCEL ---
// This tells Express to trust the Load Balancer's IP forwarding
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

// --- DATA LOADER ---
const loadCasinos = () => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'data', 'casinos.json'));
    return JSON.parse(rawData);
  } catch (err) {
    console.error("Database Error:", err);
    return [];
  }
};

// --- MIDDLEWARE: HYBRID GEO-COMPLIANCE ---
const checkOntario = (req, res, next) => {
  
  // 1. GOD MODE (Bypass for Dev/Testing)
  // Usage: https://your-app.vercel.app/?dev=true
  if (req.query.dev === 'true') {
      return next();
  }

  // 2. VERCEL NATIVE CHECK (Most Accurate)
  // Vercel does geolocation at the "Edge" and passes headers.
  const vercelCountry = req.headers['x-vercel-ip-country'];
  const vercelRegion = req.headers['x-vercel-ip-country-region']; // Returns 'ON' for Ontario

  if (vercelCountry) {
      if (vercelCountry === 'CA' && vercelRegion === 'ON') {
          return next(); // Approved via Vercel Header
      }
      // If Vercel says you aren't in ON, block immediately
      return res.status(403).send(`<h1>Region Restricted (Vercel)</h1><p>Detected: ${vercelRegion}, ${vercelCountry}</p>`);
  }

  // 3. FALLBACK: STANDARD IP CHECK (For Hostinger/Localhost)
  const ip = req.clientIp;
  
  // Localhost Bypass
  if (ip === '::1' || ip === '127.0.0.1' || req.hostname === 'localhost') {
      return next();
  }

  const geo = geoip.lookup(ip);
  if (geo && geo.region !== 'ON' && geo.country === 'CA') {
     return res.status(403).send(`<h1>Region Restricted</h1><p>Detected: ${geo.region}</p>`);
  }
  
  // Strict International Block
  if (geo && geo.country !== 'CA') {
     return res.status(403).send('<h1>Access Denied</h1><p>Not available in your country.</p>');
  }

  next();
};

// --- ROUTES ---

// 1. DEBUG ROUTE (Use this to see what Vercel sees!)
app.get('/debug', (req, res) => {
    res.json({
        ip: req.clientIp,
        vercelCountry: req.headers['x-vercel-ip-country'],
        vercelRegion: req.headers['x-vercel-ip-country-region'],
        headers: req.headers
    });
});

// 2. Main Dashboard
app.get('/', checkOntario, (req, res) => {
  const casinos = loadCasinos();
  res.render('dashboard', { 
    casinos: JSON.stringify(casinos)
  });
});

// 3. Affiliate Redirection
app.get('/go/:id', (req, res) => {
  const casinos = loadCasinos();
  const target = casinos.find(c => c.id === req.params.id);
  if (target) {
    res.redirect(target.affiliate_link);
  } else {
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`Portkey Server is running on port ${PORT}`);
});

