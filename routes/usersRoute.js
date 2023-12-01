const router = require('express').Router();
const { updateUser } = require('../utils/firebase');

const { ensureAuthenticated, getUserByEmail } = require('../utils/firebase');

// GET /api/users/:email
router.get('/:email', ensureAuthenticated, async (req, res) => {
  const userData = await getUserByEmail(req.params.email);

  res.json(userData);
});

// PUT /api/users
router.put('/', ensureAuthenticated, async (req, res) => {
  const { email, data } = req.body;

  const userData = await getUserByEmail(email);
  await updateUser(userData.id, data);

  res.status(200).json({ message: 'cool' });
});

module.exports = router;
