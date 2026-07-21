const { Router } = require('express');
const { matchPrograms } = require('../controllers/programs.controller');

const router = Router();

/**
 * POST /api/programs/match
 * Returns government programs matched to the user's profile and category.
 */
router.post('/match', matchPrograms);

module.exports = router;
