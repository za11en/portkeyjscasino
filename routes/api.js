const express = require('express');
const router = express.Router();
const checkOntarioAPI = require('../middleware/geoCheck');
const CASINO_DB = require('../data/casinos'); // Make sure this path is correct
const { WEEKLY_SCHEDULE, SLOTS_DATA, PAYMENTS_DB, SKILL_ARTICLES } = require('../data/content');

// The frontend fetches /api/data, so this route MUST match
router.get('/api/data', checkOntarioAPI, (req, res) => {
    res.json({
        casinos: CASINO_DB,
        slots: SLOTS_DATA,       // <--- Ensure this is SLOTS_DATA
        payments: PAYMENTS_DB,
        weekly: WEEKLY_SCHEDULE, // <--- Ensure this is sending
        articles: SKILL_ARTICLES // <--- Ensure this is sending
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
