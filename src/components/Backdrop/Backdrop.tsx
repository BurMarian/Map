import React from 'react';

// Styles
import styles from './Backdrop.module.scss';

export function Backdrop() {
  return (
    <div className={styles.backdrop}>
      <div className={styles.backdrop_content}>Loading...</div>
    </div>
  );
}
