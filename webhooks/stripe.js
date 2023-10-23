const { insertSubscription } = require('../utils/firebase');

const router = require('express').Router();

// POST /webhook/stripe
router.post('/', (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'invoice.payment_succeeded':
      handlePaymentSucceeded(event);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

function handlePaymentSucceeded(e) {
  insertSubscription(e.data.object);
}

module.exports = router;
