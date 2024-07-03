import React from 'react';
import styles from './MarathonCard.module.scss';

export default function MarathonCard({marathon}) {
  const lines = marathon.description.split('\n');
  return (
    <div className={styles.marathon__container}>
      <div className={styles.marathon__course__wrapper}>
        <span className={styles.marathon__course}>{marathon.course.name}</span>
        <button className={styles.marathon__button}>Details</button>
      </div>
      <div className={styles.marathon__description}>
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
}
