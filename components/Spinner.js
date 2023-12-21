// Spinner.js
import React from "react";
import styles from "./Spinner.module.css"; // Create a separate CSS file for styling

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spinner;
