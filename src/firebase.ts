import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: "XXXX",
    authDomain: "XXXX",
    databaseURL: "XXXX",
    projectId: "XXXX",
    storageBucket: "XXXX",
    messagingSenderId: "XXXX",
    appId: "XXXX",
};

firebase.initializeApp(config);
export const db = firebase.database();
export const databaseRef = firebase.database().ref();
export const locationsRef = databaseRef.child("locations")
export const itemsRef = databaseRef.child("items")
export default firebase;
