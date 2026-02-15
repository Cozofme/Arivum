// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyChuAzsMf2MRz3jGiwsuY410_ezqCt-OXk",
  authDomain: "my-studybuddy-009.firebaseapp.com",
  projectId: "my-studybuddy-009",
  storageBucket: "my-studybuddy-009.firebasestorage.app",
  messagingSenderId: "404743975538",
  appId: "1:404743975538:web:37015c0145c408ca0748eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
