import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "theta-function-427410-k9.firebaseapp.com",
  projectId: "theta-function-427410-k9",
  storageBucket: "theta-function-427410-k9.appspot.com",
  messagingSenderId: "761391664119",
  appId: "1:761391664119:web:7452611660eac77968fcf2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);