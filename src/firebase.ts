import { Dispatch, SetStateAction } from 'react';
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

export const provider = new firebase.auth.GithubAuthProvider();
export const signIn = () => firebase.auth().signInWithRedirect(provider);
firebase.auth().getRedirectResult().then(function (result) {
    console.info('User successfully signed in');
}).catch(function (error) {
    console.error('Login error', error);
});

export const signOut = () => (
    firebase.auth().signOut().then(function () {
        console.info('User successfully signed out');
    }).catch(function (error) {
        console.error('Logout error', error);
    })
);

export const checkLoggedInStatus = (setIsLoggedIn: Dispatch<SetStateAction<boolean | undefined>>) => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    });
};

export const storage = firebase.storage()
export const db = firebase.database();
export const databaseRef = firebase.database().ref();
export const locationsRef = databaseRef.child("locations")
export const itemsRef = databaseRef.child("items")

export const getItemDataOnce = (itemId: string) => {
    return db.ref(`/items/${itemId}`).once('value').then(function (snapshot) {
        const item = snapshot.val();
        return item;
    });
}

export default firebase;
