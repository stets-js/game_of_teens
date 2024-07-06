import React from 'react';
import {useNavigate} from 'react-router-dom';

import styles from './MarathonCard.module.scss';
import buttonStyle from '../../styles/Button.module.scss';
import MarathonDescription from './MarathonDescription';

export default function MarathonCard({marathon}) {
  const lines = marathon.description.split('\n');
  const navigate = useNavigate();
  return (
    <div className={styles.marathon__container}>
      <div className={styles.marathon__course__wrapper}>
        <span className={styles.marathon__course}>{marathon.course.name}</span>
        <button
          onClick={() => {
            navigate(`./${marathon._id}`, {state: {marathon_state: marathon}});
          }}
          className={buttonStyle.button}>
          Деталі
        </button>
      </div>
      <div className={styles.marathon__description}>
        <span className={styles.marathon__description__name}>Опис:</span>
        <div className={styles.marathon__description__text}>
          <MarathonDescription description={marathon.description} />
        </div>
      </div>
    </div>
  );
}
