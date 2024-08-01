import React, {useEffect, useState} from 'react';
import {success} from '@pnotify/core';
import Modal from '../Modal/Modal';
import FormInput from '../FormInput/FormInput';
import {createCriteria} from '../../helpers/criterias/criterias';
import styles from '../users/NewUser.module.scss';
const NewCritera = ({isOpen, handleClose, handleSubmit}) => {
  const [credentials, setCredentials] = useState({name: ''});
  const submit = async () => {
    const res = await createCriteria(credentials);
    success('Створенно новий критерій,');
    if (res) {
      handleSubmit();
      handleClose();
    }
  };
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <h1>New Criteria</h1>
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

          <button className={styles.button__create} onClick={() => submit()}>
            Create
          </button>
        </Modal>
      )}
    </>
  );
};

export default NewCritera;
