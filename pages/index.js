import { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { useRouter } from "next/router";
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/SignUp";
import GifSearch from "../components/GifSearch";
import styles from "./index.module.css";
import {
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const IndexPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("login");
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [invalidCredential, setInvalidCredential] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  
  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
      console.log("Verification email sent");
    } catch (error) {
      console.error("Error sending verification email", error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setEmailVerificationSent(true);
      sendVerificationEmail(user);
      // Handle successful sign-up
    } catch (error) {
      // Handle sign-up error
      console.error("Sign-up error", error.message);

      if (error.code === "auth/email-already-in-use") {
        setAccountNotFound(true);
      } else if (error.code === "auth/invalid-credential") {
        setInvalidCredential(true);
      }
    }
  };

      useEffect(() => {
        const checkEmailVerification = async () => {
          const user = auth.currentUser;
          if (user && !user.emailVerified && emailVerificationSent) {
            try {
              await user.reload();
              await auth.currentUser.getIdToken(true);
              if (auth.currentUser.emailVerified) {
                router.push("/");
              } else {
                console.log("Email verification is still pending.");
              }
            } catch (error) {
              console.error("Error checking email verification", error.message);
            }
          }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            checkEmailVerification();
          }
        });

        return () => unsubscribe();
      }, [emailVerificationSent, router]);
    

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {!auth.currentUser ? (
        <div className={styles.loginSignUp}>
          <div className={styles.loginDetails}>
            {currentPage === "login" && (
              <>
                {accountNotFound && (
                  <p className={styles.errorMessage}>
                    Account not found. Please create an account.
                  </p>
                )}
                {invalidCredential && (
                  <p className={styles.errorMessage}>
                    Invalid credentials. Please check your email and password.
                  </p>
                )}

                {emailVerificationSent && (
                  <p className={styles.message}>
                    Verification email sent. Please check your email and click
                    on the verification link. After verification, please log in
                    for your security.
                  </p>
                )}
                <Login
                  setAccountNotFound={setAccountNotFound}
                  setInvalidCredential={setInvalidCredential}
                />
                <div>
                  <button onClick={() => handlePageChange("signup")}>
                    Create your account
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={styles.signupDetails}>
            {currentPage === "signup" && (
              <>
                {accountNotFound && (
                  <p className={styles.errorMessage}>
                    Email already in use. Please use a different email.
                  </p>
                )}
                {invalidCredential && (
                  <p className={styles.errorMessage}>
                    Invalid credentials. Please check your email and password.
                  </p>
                )}
                {emailVerificationSent && (
                  <p className={styles.message}>
                    Verification email sent. Please check your email and click
                    on the verification link. After verification, please log in
                    for your security.
                  </p>
                )}
                <SignUp
                  setAccountNotFound={setAccountNotFound}
                  setInvalidCredential={setInvalidCredential}
                  setEmailVerificationSent={setEmailVerificationSent}
                  handleSignUp={handleSignUp}
                />
                <div>
                  <button onClick={() => handlePageChange("login")}>
                    Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <GifSearch />
      )}
    </div>
  );
};

export default IndexPage;