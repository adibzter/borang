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
    console.log(decodedToken);
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

const insertUser = async (email) => {
  const userData = {
    badges: [],
    email,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
  return await db.collection('users').add(userData);
};

const insertSubscription = async (user_id, stripeData) => {
  const usersRef = db.collection('users');

  const snapshot = await usersRef
    .where('email', '==', stripeData.customer.email)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return;
  }

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data();

  const subscriptionData = {
    user_id: userDoc.id,
    created_at: Date.now(),
    updated_at: Date.now(),
    stripe: {
      customer: {
        id: stripeData.customer.id,
        email: stripeData.customer.email,
      },
      id: stripeData.id,
      start_date: stripeData.start_date,
      status: stripeData.status,
    },
  };

  await db.collection('subscriptions').add(subscriptionData);
  await db
    .collection('users')
    .doc(userDoc.id)
    .update({ badges: [...userData.badges, 'skrin-premium'] });
};

module.exports = { ensureAuthenticated, insertSubscription, insertUser };
