const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = require('../secrets/firebase-service-account.json');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    return true;
  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }
};

const ensureAuthenticated = async (req, res, next) => {
  const authorizationHeader = req.header('Authorization');
  if (!authorizationHeader) {
    return res.send('Authorization header not present');
  }

  const idToken = authorizationHeader.split(' ')[1];
  const isTokenVerified = await verifyIdToken(idToken);

  if (isTokenVerified) {
    return next();
  } else {
    return res.send('Token not valid');
  }
};

const getUser = async (email) => {
  const usersRef = db.collection('users');
  const userSnapshot = await usersRef
    .where('email', '==', email)
    .limit(1)
    .get();

  if (userSnapshot.empty) {
    return null;
  }

  const userDoc = userSnapshot.docs[0];

  return userDoc.data();
};

const getSubscription = async (customer) => {
  const subscriptionsRef = db.collection('subscriptions');
  const subscriptionSnapshot = await subscriptionsRef
    .where('stripe.customer', '==', customer)
    .limit(1)
    .get();

  if (subscriptionSnapshot.empty) {
    return null;
  }

  const subscriptionDoc = subscriptionSnapshot.docs[0];

  return subscriptionDoc.data();
};

const insertUser = async (email) => {
  const userData = {
    badges: [],
    email,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
  return await db.collection('users').add(userData);
};

const insertSubscription = async (stripeObject) => {
  // Temporary solution
  const customerEmail = stripeObject.customer_email;
  await insertUser(customerEmail);

  const usersRef = db.collection('users');
  const userSnapshot = await usersRef
    .where('email', '==', customerEmail)
    .limit(1)
    .get();

  if (userSnapshot.empty) {
    return null;
  }

  const userDoc = userSnapshot.docs[0];
  const userData = userDoc.data();

  const subscriptionData = {
    user_id: userDoc.id,
    created_at: Date.now(),
    updated_at: Date.now(),
    stripe: {
      status: stripeObject.status,
      customer: stripeObject.customer,
      customer_email: stripeObject.customer_email,
    },
  };

  await db.collection('subscriptions').add(subscriptionData);
  await db
    .collection('users')
    .doc(userDoc.id)
    .update({ badges: [...userData.badges, 'skrin-premium'] });
};

const removeSkrinPremiumBadge = async (stripeObject) => {
  const customer = stripeObject.customer;
  const subscriptionData = await getSubscription(customer);

  const usersRef = db.collection('users');
  const userSnapshot = await usersRef
    .where('email', '==', subscriptionData.stripe.customer_email)
    .limit(1)
    .get();

  if (userSnapshot.empty) {
    return null;
  }

  const userDoc = userSnapshot.docs[0];
  const userData = userDoc.data();

  await db
    .collection('users')
    .doc(userDoc.id)
    .update({
      badges: userData.badges.filter((badge) => badge !== 'skrin-premium'),
    });
};

module.exports = {
  ensureAuthenticated,
  insertSubscription,
  getUser,
  insertUser,
  removeSkrinPremiumBadge,
};
