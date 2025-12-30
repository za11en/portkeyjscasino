const express = require('express');
const router = express.Router();
const checkOntarioAPI = require('../middleware/geoCheck');
const CASINO_DB = require('../data/casinos');
// Import the new data objects
const { WEEKLY_SCHEDULE, SLOTS_DATA, PAYMENTS_DB, SKILL_ARTICLES } = require('../data/content');

// NOTE: We now serve "weekly_schedule" and "skill_articles" instead of just daily_drops
router.get('/api/data', checkOntarioAPI, (req, res) => {
    res.json({
        casinos: CASINO_DB,
        slots: SLOTS_DATA,       // Updated object with 3 arrays
        payments: PAYMENTS_DB,
        weekly: WEEKLY_SCHEDULE, // Replaces daily_drops
        articles: SKILL_ARTICLES // New deep-dive content
    });
});

router.get('/go/:id', (req, res) => {
    const target = CASINO_DB.find(c => c.id === req.params.id);
    if (target) {
        res.redirect(target.affiliate_link);
    } else {
        res.redirect('/');
    }
});

module.exports = router;

