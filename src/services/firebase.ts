
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// --- REAL FIREBASE CONFIGURATION ---
export const firebaseConfig = {
  apiKey: "AIzaSyAT0ljTn2R39xMwv0SyRyJoDDhGdR36nsY",
  authDomain: "lords-tailor-87f35.firebaseapp.com",
  projectId: "lords-tailor-87f35",
  storageBucket: "lords-tailor-87f35.firebasestorage.app",
  messagingSenderId: "880443699412",
  appId: "1:880443699412:web:77fbd6d6eeb41884184b41",
  measurementId: "G-MYNZNJ3E65"
};

let db: Firestore | null = null;
let initError: any = null;
let app: FirebaseApp | null = null;

try {
    // Check if app is already initialized to avoid "Duplicate App" errors
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    if (app) {
        db = getFirestore(app);
        console.log("⚡ Firebase Kernel: Online");
    }
} catch (error: any) {
    console.error("Firebase Kernel: Offline (Switching to Demo Mode)", error);
    initError = error;
    db = null; // Explicitly set to null to trigger Demo Mode in AppContext
}

export { db, initError };
