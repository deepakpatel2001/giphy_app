import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "./loginSignUp.module.css"

const Login = ({ setAccountNotFound, setInvalidCredential }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
      // Handle successful login
    } catch (error) {
      // Handle login error
      console.error("Login error", error.message);

      if (error.code === "auth/user-not-found") {
        setAccountNotFound(true);
      } else if (error.code === "auth/invalid-credential") {
        setInvalidCredential(true);
      }
    }
  };

  return (
    <div className={styles.parentLogin}>
      <h3 className={styles.heading}>Login For Gifs...</h3>
      <div className={styles.loginFirstInput}>
        <input
          type="email"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
          className={styles.loginFirstInputdata}
        />
      </div>

      <div className={styles.loginFirstInput}>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.loginSecondInputdata}
        />
      </div>

      <div className={styles.loginButtonDiv}>
        <button onClick={handleLogin} className={styles.loginButton}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;