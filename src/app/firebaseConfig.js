import { initializeApp } from 'firebase/app';
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCOitnPf8K_N7ZwNSq4kVIeiSn0pCf3VGA",
    authDomain: "ecogestion-c9580.firebaseapp.com",
    projectId: "ecogestion-c9580",
    storageBucket: "ecogestion-c9580.appspot.com",
    messagingSenderId: "625097701804",
    appId: "1:625097701804:web:cab18e867be4fc596fe209",
    measurementId: "G-57WS4QGWJT"  
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export { app };
