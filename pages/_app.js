// _app.js
import { useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Handle authentication state change
    });

    return () => unsubscribe();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;