import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyByXoBp6vtJJVcXGkUOMnBZwpLX8aBMoG4",
  authDomain: "anim-os-de470.firebaseapp.com",
  projectId: "anim-os-de470",
  storageBucket: "anim-os-de470.firebasestorage.app",
  messagingSenderId: "164490716722",
  appId: "1:164490716722:web:07ff8d7a889cac3a9cfe2b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
