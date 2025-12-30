const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURATION ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(requestIp.mw());

// --- SECURITY ---
// Relaxed CSP for inline scripts (Vue/Tailwind CDN)
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

// --- MIDDLEWARE: GEO-COMPLIANCE ---
const checkOntario = (req, res, next) => {
  // Allow bypass for Localhost/Dev
  if (req.hostname === 'localhost' || req.hostname === '127.0.0.1') return next();

  const ip = req.clientIp;
  const geo = geoip.lookup(ip);

  // If we can't determine geo, we default to BLOCK in production for safety
  // For this MVP, if geo is null, we log it and proceed (soft fail)
  if (geo && geo.region !== 'ON' && geo.country === 'CA') {
     // User is in Canada but not Ontario
     return res.status(403).send('<h1>Region Restricted</h1><p>This site is authorized for Ontario residents only.</p>');
  }
  
  // Strict International Block
  if (geo && geo.country !== 'CA') {
     return res.status(403).send('<h1>Access Denied</h1><p>Not available in your country.</p>');
  }

  next();
};

// --- ROUTES ---

// 1. Main Dashboard
app.get('/', checkOntario, (req, res) => {
  const casinos = loadCasinos();
  res.render('dashboard', { 
    casinos: JSON.stringify(casinos) // Pass data to frontend
  });
});

// 2. Affiliate Redirection (Tracker)
app.get('/go/:id', (req, res) => {
  const casinos = loadCasinos();
  const target = casinos.find(c => c.id === req.params.id);
  
  if (target) {
    console.log(`[CLICK] User redirected to ${target.id} at ${new Date().toISOString()}`);
    res.redirect(target.affiliate_link);
  } else {
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`Portkey Server is running on port ${PORT}`);
});
