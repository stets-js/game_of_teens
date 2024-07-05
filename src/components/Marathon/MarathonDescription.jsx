import React from 'react';
import styles from './MarathonCard.module.scss';
export default function MarathonDescription({description}) {
  const lines = description.split('\n');

  return (
    <>
      {lines.map((line, index) =>
        line === '' ? (
          <br key={index} />
        ) : (
          <p className={styles.indented} key={index}>
            {line}
          </p>
        )
      )}
    </>
  );
}
