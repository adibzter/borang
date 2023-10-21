const router = require('express').Router();

const { ensureAuthenticated } = require('../utils/firebase');

// GET /api/subscription
router.get('/', ensureAuthenticated, async (req, res) => {
  //   try {
  //     const folderInfo = await getFolderInfo(id);
  //     res.json(folderInfo);
  //   } catch (err) {
  //     console.error(err.message);
  //     res.status(404).json({});
  //   }

  res.send('noice');
});

module.exports = router;
