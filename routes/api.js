
const express = require('express');
const router = express.Router();
const checkOntarioAPI = require('../middleware/geoCheck');
const CASINO_DB = require('../data/casinos');
const { DAILY_DROPS, SLOTS_DB, PAYMENTS_DB } = require('../data/content');

// FIX: Changed '/data' to '/api/data' to match frontend fetch
router.get('/api/data', checkOntarioAPI, (req, res) => {
    res.json({
        casinos: CASINO_DB,
        slots: SLOTS_DB,
        payments: PAYMENTS_DB,
        daily_drops: DAILY_DROPS
    });
});

// Redirect Endpoint (remains the same)
router.get('/go/:id', (req, res) => {
    const target = CASINO_DB.find(c => c.id === req.params.id);
    if (target) {
        res.redirect(target.affiliate_link);
    } else {
        res.redirect('/');
    }
});

module.exports = router;
