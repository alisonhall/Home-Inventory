import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const {
    REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_APP_ID,
    REACT_APP_FIREBASE_AUTH_DOMAIN,
    REACT_APP_FIREBASE_DATABASE_URL,
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    REACT_APP_FIREBASE_PROJECT_ID,
    REACT_APP_FIREBASE_STORAGE_BUCKET
} = process.env;

const config = {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
    projectId: REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID
};

firebase.initializeApp(config);

export const storage = firebase.storage()
export const db = firebase.database();
export const databaseRef = firebase.database().ref();
export const locationsRef = databaseRef.child("locations")
export const itemsRef = databaseRef.child("items")
export default firebase;
