import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styles from './PlayerPage.module.scss';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import Header from '../../components/Header/Header';
import logo from '../../img/goiteensLOGO.png';
import logout from '../../img/logout.svg';
export default function PlayerPage() {
  const userName = useSelector(state => state.auth.user.name);
  const userId = useSelector(state => state.auth.user.id);
  const dispatch = useDispatch();
  return (
    <>
      <div className={styles.header__container}>
        <div className={styles.header__main}>
          <PlayerHeader></PlayerHeader>
          <img src={logo} alt="logo" className={styles.logo} />
        </div>
        <aside className={styles.aside__wrapper}>
          <img
            src="https://res.cloudinary.com/dn4cdsmqr/image/upload/v1718283847/mm3lxhqednahjjypnuge.jpg"
            alt="avatar"
            id="avatar"
            className={styles.avatar}
          />
          <div className={styles.avatar__label__wrapper}>
            <label htmlFor="avatar" className={styles.avatar__label}>
              {userName}
            </label>
            <button
              type="button"
              className={styles.logout}
              onClick={() => {
                localStorage.removeItem('got');
                dispatch({
                  type: 'LOGOUT'
                });
              }}>
              <img src={logout} alt="logout" />
            </button>
          </div>
        </aside>
      </div>
      <div></div>
    </>
  );
}
