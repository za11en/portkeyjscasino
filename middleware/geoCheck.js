const geoip = require('geoip-lite');
const requestIp = require('request-ip');

const checkOntarioAPI = (req, res, next) => {
    // 1. Dev bypass
    if (req.query.dev === 'true' || req.headers.referer?.includes('dev=true')) return next();
    
    // 2. Vercel/Cloud host headers
    const vercelRegion = req.headers['x-vercel-ip-country-region'];
    if (vercelRegion === 'ON') return next();
    
    // 3. Localhost bypass
    const ip = req.clientIp;
    if (ip === '::1' || ip === '127.0.0.1' || req.hostname === 'localhost') return next();
    
    // 4. GeoIP Lookup
    const geo = geoip.lookup(ip);
    if (geo && (geo.region !== 'ON' || geo.country !== 'CA')) {
        return res.status(403).json({ error: "RESTRICTED", region: geo ? geo.region : "Unknown" });
    }
    
    next();
};

module.exports = checkOntarioAPI;
