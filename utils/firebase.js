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

const getUserByEmail = async (email) => {
  const usersRef = db.collection('users');
  const userSnapshot = await usersRef
    .where('email', '==', email)
    .limit(1)
    .get();

  if (userSnapshot.empty) {
    return null;
  }

  const userDoc = userSnapshot.docs[0];
  const userData = {
    id: userDoc.id,
    ...userDoc.data(),
  };

  return userData;
};

const insertUser = async (email) => {
  let userData = {
    badges: [],
    email,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
  const userRef = await db.collection('users').add(userData);

  userData = {
    id: userRef.id,
    ...userData,
  };

  return userData;
};

const updateUser = async (userId, data) => {
  await db.collection('users').doc(userId).update(data);
};

const getSubscriptionById = async (subscriptionId) => {
  const subscriptionsRef = db.collection('subscriptions');
  const subscriptionSnapshot = await subscriptionsRef
    .where('stripe.subscription', '==', subscriptionId)
    .limit(1)
    .get();

  if (subscriptionSnapshot.empty) {
    return null;
  }

  const subscriptionDoc = subscriptionSnapshot.docs[0];
  const subscriptionData = {
    id: subscriptionDoc.id,
    ...subscriptionDoc.data(),
  };

  return subscriptionData;
};

const insertSubscription = async (userId, invoiceObject) => {
  let subscriptionData = {
    user_id: userId,
    created_at: Date.now(),
    updated_at: Date.now(),
    stripe: {
      status: invoiceObject.status,
      customer: invoiceObject.customer,
      customer_email: invoiceObject.customer_email,
      subscription: invoiceObject.subscription,
    },
  };
  const subscriptionRef = await db
    .collection('subscriptions')
    .add(subscriptionData);

  subscriptionData = {
    id: subscriptionRef.id,
    ...subscriptionData,
  };

  return subscriptionData;
};

const updateSubscription = async (subscriptionId, data) => {
  await db.collection('subscriptions').doc(subscriptionId).update(data);
};

const upsertSubscription = async (invoiceObject) => {
  let userData = await getUserByEmail(invoiceObject.customer_email);

  if (!userData) {
    userData = await insertUser(invoiceObject.customer_email);

    await updateUser(userData.id, {
      badges: [...userData.badges, 'skrin-premium'],
    });
  } else {
    if (!userData.badges.includes('skrin-premium')) {
      await updateUser(userData.id, {
        updated_at: Date.now(),
        badges: [...userData.badges, 'skrin-premium'],
      });
    }
  }

  let subscriptionData = await getSubscriptionById(invoiceObject.subscription);

  if (!subscriptionData) {
    await insertSubscription(userData.id, invoiceObject);
  } else {
    await updateSubscription(invoiceObject.subscription, {
      updated_at: Date.now(),
    });
  }
};

const removeSkrinPremiumBadge = async (subscriptionObject) => {
  const subscriptionData = await getSubscriptionById(subscriptionObject.id);
  const userData = await getUserByEmail(subscriptionData.stripe.customer_email);

  await updateSubscription(subscriptionData.id, {
    updated_at: Date.now(),
    'stripe.status': subscriptionObject.status,
  });
  await updateUser(userData.id, {
    updated_at: Date.now(),
    badges: userData.badges.filter((badge) => badge !== 'skrin-premium'),
  });
};

module.exports = {
  ensureAuthenticated,
  upsertSubscription,
  getUserByEmail,
  removeSkrinPremiumBadge,
};
