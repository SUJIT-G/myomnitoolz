import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// This is the configuration for the Firebase project.
// It is assumed to be correct and pre-configured for the application to work.
const firebaseConfig = {
  apiKey: "AIzaSyC1QUoa6XihQ3dksEP8lk06ldCwhaKYSDo", 
  authDomain: "myomnitoolzapp.firebaseapp.com", 
  projectId: "myomnitoolzapp", 
  storageBucket: "myomnitoolzapp.appspot.com", 
  messagingSenderId: "1074704215519", 
  appId: "1:1074704215519:web:783c2013888997ddc0e86a", 
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = firebase.app();
const db = firebase.firestore();
const auth = firebase.auth();


export { db, auth, app, firebase };