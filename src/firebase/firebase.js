import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyBzmV2bS-FVMCYq8KR-hj2W0Hw04Q_MGUs",
  authDomain: "react-firebase-authentic-81054.firebaseapp.com",
  databaseURL: "https://react-firebase-authentic-81054.firebaseio.com",
  projectId: "react-firebase-authentic-81054",
  storageBucket: "react-firebase-authentic-81054.appspot.com",
  messagingSenderId: "651284461293"
};

// if (!firebase.apps.length) {
//   firebase.initializeApp(config);
// }

firebase.initializeApp(config);

const auth = firebase.auth();
//
// export {
//   auth,
// };

const db = firebase.firestore();

export {
  firebase,
  auth,
  db,
};

// export default firebase;
