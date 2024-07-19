import React from 'react';
import styles from './Chat.module.scss';
import classNames from 'classnames';

import {format} from 'date-fns';
import {useSelector} from 'react-redux';
export default function MessageCard({leader, message, userId}) {
  const userRole = useSelector(state => state.auth.user.role);
  return (
    <div
      className={classNames(
        styles.card,
        leader === message.sender._id || userId === message.sender._id
          ? styles.card__end
          : styles.card__start
      )}>
      <p>
        {message.sender.name} {userRole !== 2 && `(${message.sender?.role})`}
      </p>
      <div>{message.text}</div>
      <span className={styles.card__time}>{format(message.createdAt, 'HH:mm:ss dd.MM.yyyy')}</span>
    </div>
  );
}
