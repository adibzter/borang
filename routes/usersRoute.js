const router = require('express').Router();

const { ensureAuthenticated, getUser } = require('../utils/firebase');

// GET /api/users/:email
router.get('/:email', ensureAuthenticated, async (req, res) => {
  const userData = await getUser(req.params.email);

  res.json(userData);
});

module.exports = router;