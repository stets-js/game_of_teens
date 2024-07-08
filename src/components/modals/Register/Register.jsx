import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {success, error, defaults} from '@pnotify/core';

import styles from '../Login/Login.module.scss';
// import registerStyles from './Register.module.scss';

import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import {loginUser, registerUser} from '../../../helpers/auth/auth';

const Register = ({isOpen, handleClose}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const data = {
        email: email.trim(),
        role: 'player',
        name,
        password
      };
      const res = await registerUser(data);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: res.token
        }
      });
      handleClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      error(err.response.data.message);
    }
  };

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <h3 className={styles.title}>Register</h3>
          <form>
            <FormInput
              classname={styles.title}
              title="Name:"
              type="text"
              name="name"
              value={name}
              placeholder="Name"
              isRequired={true}
              handler={setName}
            />

            <FormInput
              classname={styles.title}
              title="Email:"
              type="text"
              name="email"
              value={email}
              placeholder="Email"
              isRequired={true}
              handler={setEmail}
            />

            <FormInput
              title="Password:"
              type="password"
              name="password"
              value={password}
              min={5}
              placeholder="Password"
              isRequired={true}
              handler={setPassword}
            />

            <button
              type="button"
              onClick={e => {
                const tokenFromLocalStorage = localStorage.getItem('got');

                if (tokenFromLocalStorage) {
                  dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: {
                      token: tokenFromLocalStorage
                    }
                  });
                } else {
                  handleSubmit(e);
                }
              }}
              className={styles.login}>
              Register
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Register;
