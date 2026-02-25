
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQN-J092tAduaqqcDisIL3rxUNtbimNiQ",
  authDomain: "fintrack-mini.firebaseapp.com",
  projectId: "fintrack-mini",
  storageBucket: "fintrack-mini.firebasestorage.app",
  messagingSenderId: "484115869109",
  appId: "1:484115869109:web:7f685e7ec071ea69387dfc",
  measurementId: "G-NZ69VH31K5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
