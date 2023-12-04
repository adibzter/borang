const router = require('express').Router();

// router.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// POST /api/proxies
router.post('/', async (req, res) => {
  const request = req.body.request;

  try {
    const response = await fetch(request.url, request);
    const text = await response.text();

    // for (var pair of response.headers.entries()) {
    //   res.header(pair[0], pair[1]);
    // }

    res.header('content-type', response.headers.get('content-type'));
    res.header('connection', 'close');
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ message: 'boo', err });
  }
});

module.exports = router;
