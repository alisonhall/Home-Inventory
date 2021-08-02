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
let uid = '';
firebase.auth().getRedirectResult().then(function (result) {
    console.info('User successfully signed in');
}).catch(function (error) {
    console.error('Login error', error);
});

export const signOut = () => (
    firebase.auth().signOut().then(function () {
        console.info('User successfully signed out');
        uid = '';
    }).catch(function (error) {
        console.error('Logout error', error);
    })
);

export const checkLoggedInStatus = (setIsLoggedIn: Dispatch<SetStateAction<boolean | undefined>>, setUserId: Dispatch<SetStateAction<string | null>>) => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user && user.uid) {
            uid = user.uid;
            setUserId(uid);
            locationsRef = databaseRef.child(uid).child("locations");
            itemsRef = databaseRef.child(uid).child("items");
            setIsLoggedIn(true);
        } else {
            setUserId(null);
            setIsLoggedIn(false);
        }
    });
};

export const storage = firebase.storage();
export const db = firebase.database();
export const databaseRef = firebase.database().ref();
export let locationsRef = uid !== '' && databaseRef.child(uid).child("locations");
export let itemsRef = uid !== '' && databaseRef.child(uid).child("items");

export const getItemDataOnce = (itemId: string) => {
    return db.ref(`/${uid}/items/${itemId}`).once('value').then(function (snapshot) {
        const item = snapshot.val();
        return item;
    });
}

export const logUserStorageFileUrls = () => {
    const fileUrls: string[] = [];

    storage
        .ref("images")
        .listAll()
        .then((res) => {
            res.items?.forEach((itemRef) => {
                itemRef.getDownloadURL().then((url) => {
                    fileUrls.push(url);
                });
            });
        }).then(() => {
            console.warn({ fileUrls });
        });
}

export default firebase;
