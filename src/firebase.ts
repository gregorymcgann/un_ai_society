import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDdiwfKlixwMBpQbFglyNuJY6kSGtuhOcQ",
  authDomain: "aiprodtesting.firebaseapp.com",
  projectId: "aiprodtesting",
  storageBucket: "aiprodtesting.firebasestorage.app",
  messagingSenderId: "896400282415",
  appId: "1:896400282415:web:da481511894404908b47da"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

export default app;
