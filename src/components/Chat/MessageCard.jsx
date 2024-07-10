import React from 'react';
import styles from './Chat.module.scss';
import classNames from 'classnames';

import {format} from 'date-fns';
export default function MessageCard({leader, message, userId}) {
  return (
    <div
      className={classNames(
        styles.card,
        leader === message.sender._id || userId === message.sender._id
          ? styles.card__end
          : styles.card__start
      )}>
      <p>{message.sender.name}</p>
      <div>{message.text}</div>
      <span className={styles.card__time}>{format(message.createdAt, 'HH:mm:ss dd.MM.yyyy')}</span>
    </div>
  );
}
