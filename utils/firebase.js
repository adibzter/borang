const {
  initializeApp,
  applicationDefault,
  cert,
} = require('firebase-admin/app');
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require('firebase-admin/firestore');
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

const addSubscription = async (email) => {
  const subscriptionData = {
    stripe: {
      customer: {
        id: 'cus_OpvYisXe1tMUi2',
        email,
      },
      subscription: {
        id: 'sub_1O2FceBNLCONpnH901M1YOcE',
        status: 'active',
        start_date: 1697558156,
      },
    },
  };

  console.log(email);
  const docRef = db.collection('subscriptions').doc(email);
  await docRef.set(subscriptionData);
};

module.exports = { ensureAuthenticated, addSubscription };
