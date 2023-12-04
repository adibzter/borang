const path = require('path');
const fs = require('fs');
const { randomUUID } = require('node:crypto');

const router = require('express').Router();

const { ensureAuthenticated, getUserByEmail } = require('../utils/firebase');

// // GET /api/users/:email
// router.get('/:email', ensureAuthenticated, async (req, res) => {
//   const userData = await getUserByEmail(req.params.email);

//   res.json(userData);
// });

// // PUT /api/users
// router.put('/', ensureAuthenticated, async (req, res) => {
//   const { email, data } = req.body;

//   const userData = await getUserByEmail(email);
//   await updateUser(userData.id, data);

//   res.status(200).json({ message: 'cool' });
// });

// GET /api/files/:id
router.get('/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    // Get form from Google
    const filePath = path.join(__dirname, '..', 'temp', `${fileId}.html`);

    res.sendFile(filePath);
    res.on('finish', () => {
      fs.rmSync(filePath);
    });
  } catch (err) {
    res.status(500).json({ err });
  }
});

// POST /api/files
router.post('/', async (req, res) => {
  try {
    const url = req.body.url;

    // Get form from Google
    let htmlData = await (await fetch(url)).text();

    // const beautify = require('js-beautify').html;
    // htmlData = beautify(htmlData, { indent_size: 2 });

    const fileId = randomUUID();
    const filePath = path.join(__dirname, '..', 'temp', `${fileId}.html`);
    fs.writeFileSync(filePath, htmlData);

    res.status(200).json({ fileId });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;
