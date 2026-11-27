
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArCH4FPlfvDJNemsVJXl8_LIryrKXEowY",
  authDomain: "it-helpdesk-system-72596.firebaseapp.com",
  projectId: "it-helpdesk-system-72596",
  storageBucket: "it-helpdesk-system-72596.firebasestorage.app",
  messagingSenderId: "34813863385",
  appId: "1:34813863385:web:fe2bfb89911de542e5a5c8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
