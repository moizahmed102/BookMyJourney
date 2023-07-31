import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBc6Dxl0mbmtJ9LezqMBPFYhtxZ95yzOWU",
  authDomain: "book-my-journey.firebaseapp.com",
  projectId: "book-my-journey",
  storageBucket: "book-my-journey.appspot.com",
  messagingSenderId: "483086327612",
  appId: "1:483086327612:web:64f970bbfb73c9c86d8839"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
}


export { firebase };