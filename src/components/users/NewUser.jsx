import React, {useEffect, useState} from 'react';
import {success} from '@pnotify/core';
import styles from './NewUser.module.scss';
import Modal from '../Modal/Modal';
import FormInput from '../FormInput/FormInput';
import {createUser} from '../../helpers/users/users';

const NewUser = ({isOpen, handleClose, handleSubmit}) => {
  const [credentials, setCredentials] = useState({name: '', email: '', role: 'jury'});
  const submit = async () => {
    const res = await createUser(credentials);
    success('Створенно нового журі,');
    if (res) {
      handleSubmit();
      handleClose();
    }
  };
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <h1>New user</h1>
          <FormInput
            title="Name:"
            type="text"
            name="name"
            max={50}
            value={credentials.name}
            placeholder="Name"
            isRequired={true}
            handler={e =>
              setCredentials(prev => {
                return {...prev, name: e};
              })
            }
          />

          <FormInput
            classname="input__bottom"
            title="Email:"
            type="text"
            name="email"
            max={50}
            value={credentials.email}
            placeholder="Email"
            isRequired={true}
            handler={e =>
              setCredentials(prev => {
                return {...prev, email: e};
              })
            }
          />
          <button className={styles.button__create} onClick={() => submit()}>
            Create
          </button>
        </Modal>
      )}
    </>
  );
};

export default NewUser;
