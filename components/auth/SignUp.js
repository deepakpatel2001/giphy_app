import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./loginSignUp.module.css"

const SignUp = ({
  setAccountNotFound,
  setInvalidCredential,
  setEmailVerificationSent,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    try {
      if (password === confirmPassword) {
        await createUserWithEmailAndPassword(auth, email, password);
        setEmailVerificationSent(true);
        // Handle successful sign-up
      } else {
        // Handle password mismatch error
        console.error("Passwords do not match");
      }
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

  return (
    <div className={styles.parentSignup}>
      <h3 className={styles.heading}>Do Signup For Gifs...</h3>
      <div className={styles.loginFirstInput}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className={styles.signUpFirstInputdata}
        />
      </div>

      <div className={styles.loginFirstInput}>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.signUpSecondInputdata}
        />
      </div>

      <div className={styles.loginFirstInput}>
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.signUpThirdInputdata}
        />
      </div>

      <div className={styles.signUpButtonDiv}>
        <button onClick={handleSignUp} className={styles.signUpButton}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;