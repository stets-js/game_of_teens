import React, {useState} from 'react';
import styles from './LoginBox.module.scss';
import Login from '../modals/Login/Login';
import {useDispatch} from 'react-redux';
import logout from '../../img/logout.svg';
import Register from '../modals/Register/Register';

export default function LoginBox({loggedUser}) {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    user: {name, role}
  } = loggedUser;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  const [modal, setModal] = useState('');
  return (
    <div className={styles.loginBox}>
      <div
        className={styles.loginBoxWrapper}
        onClick={e => {
          e.target.dataset.modal && setModal(e.target.dataset.modal);
        }}>
        {modal === 'login' && <Login isOpen={isOpen} handleClose={() => setIsOpen(!isOpen)} />}
        {modal === 'register' && (
          <Register isOpen={isOpenRegister} handleClose={() => setIsOpenRegister(false)} />
        )}
        {isAuthenticated ? (
          <p className={styles.role}>Logged: {name}</p>
        ) : (
          <div className={styles.btnWrapper}>
            <button
              type="button"
              data-modal="login"
              onClick={() => {
                setIsOpen(!isOpen);
                const tokenFromLocalStorage = localStorage.getItem('got');

                if (tokenFromLocalStorage) {
                  dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: {
                      token: tokenFromLocalStorage
                    }
                  });
                }
              }}
              className={styles.login}>
              Log in
            </button>

            <button
              className={styles.login}
              type="button"
              data-modal="register"
              onClick={() => {
                setIsOpenRegister(true);
              }}>
              Register
            </button>
          </div>
        )}
      </div>

      {isAuthenticated && (
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
      )}
    </div>
  );
}
