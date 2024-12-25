import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

export function useFirebase() {
  const [firebase, setFirebase] = useState({
    app: null,
    database: null,
    storage: null,
    initialized: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !firebase.initialized) {
      try {
        const app =
          getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const database = getDatabase(app);
        const storage = getStorage(app);

        setFirebase({
          app,
          database,
          storage,
          initialized: true,
        });
      } catch (error) {
        console.error("Firebase initialization error:", error);
      }
    }
  }, [firebase.initialized]);

  return firebase;
}
