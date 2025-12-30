
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// Middleware
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

// Routes
// We mount the routes. Note: The /go/:id is technically in the api.js router,
// but since we want it at root level /go, we can mount apiRoutes at /api 
// and handle /go separately, OR just mount the router at root '/'.
// Let's mount at root to keep existing paths working (/api/data and /go/:id).
app.use('/', apiRoutes); 

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
