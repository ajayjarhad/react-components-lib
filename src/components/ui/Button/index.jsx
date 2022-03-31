import React from "react";
import styles from "./Button.module.scss";
const Button = ({ children, message }) => {
  return (
    <button className={styles.buttonStyle}>
      {children}
      {message}
    </button>
  );
};

export default Button;
