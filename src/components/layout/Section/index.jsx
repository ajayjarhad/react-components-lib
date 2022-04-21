import React from "react";
import styles from "./Section.module.scss";
const Section = () => {
  return (
    <section className={styles.section}>
      <h1 className={styles.sectionTitle}>Title</h1>
      <p className={styles.sectionContent}>Content</p>
    </section>
  );
};
export default Section;
