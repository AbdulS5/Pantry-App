import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzmjOwnJ7jwYYeYc8Y1bpU7iMlULk0yoI",
  authDomain: "pantry-app-8aa65.firebaseapp.com",
  projectId: "pantry-app-8aa65",
  storageBucket: "pantry-app-8aa65.appspot.com",
  messagingSenderId: "887728146155",
  appId: "1:887728146155:web:1f6f544bcce7035010e0ae",
  measurementId: "G-1KFLZBML06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export {firestore};
