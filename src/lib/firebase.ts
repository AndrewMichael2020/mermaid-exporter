"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    "projectId": "studio-1697788595-a34f5",
    "appId": "1:536375482650:web:b46dd322ce159659ccb4a3",
    "storageBucket": "studio-1697788595-a34f5.firebasestorage.app",
    "apiKey": "AIzaSyB1B14QbP2wLq3nMAe5FQrwh0VANbY9WEI",
    "authDomain": "studio-1697788595-a34f5.firebaseapp.com",
    "messagingSenderId": "536375482650",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
