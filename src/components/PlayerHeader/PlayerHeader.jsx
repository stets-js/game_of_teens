import React from 'react';
import {useSelector} from 'react-redux';
import styles from './PlayerHeader.module.scss';
export default function PlayerHeader() {
  const userId = useSelector(state => state.auth.user.id);

  return (
    <>
      <div className={styles.list__wrapper}>
        <div className={styles.list__item}>
          <a href={`/player/${userId}`}>Аккаунт</a>
        </div>
        <div className={styles.list__item}>
          <a href={`/player/${userId}/courses`}>Курси </a>
        </div>
      </div>
    </>
  );
}
