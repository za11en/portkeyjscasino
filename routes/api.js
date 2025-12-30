const express = require('express');
const router = express.Router();
const checkOntarioAPI = require('../middleware/geoCheck');
const CASINO_DB = require('../data/casinos');
// Import MATH_SLIDES
const { WEEKLY_SCHEDULE, SLOTS_DATA, PAYMENTS_DB, SKILL_ARTICLES, MATH_SLIDES } = require('../data/content');

router.get('/api/data', checkOntarioAPI, (req, res) => {
    res.json({
        casinos: CASINO_DB,
        slots: SLOTS_DATA,
        payments: PAYMENTS_DB,
        weekly: WEEKLY_SCHEDULE,
        articles: SKILL_ARTICLES,
        math: MATH_SLIDES // <--- Sending the new section data
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

