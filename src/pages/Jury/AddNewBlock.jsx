import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import {useState} from 'react';
import {addBlockToMarathon, getAllMarathons} from '../../helpers/marathon/marathon';
import {useEffect} from 'react';
import styles from '../Player/PlayerPage.module.scss';
import newBlockStyle from './NewBlock.module.scss';
import ButtonStyle from '../../styles/Button.module.scss';
import {useConfirm} from 'material-ui-confirm';
import {success, error, defaults} from '@pnotify/core';
import {useLocation, useNavigate} from 'react-router-dom';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import RadioButton from '../../components/RadioButton/RadioButton';

export default function AddNewBlock() {
  const confirm = useConfirm();
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);
  const {marathon} = location.state;
  const [newTitle, setNewTitle] = useState('Title');
  const [isFinalWeek, setIsFinalWeek] = useState(false);
  const [newDescription, setNewDescription] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  );

  const confirmAndCreate = async () => {
    confirm({
      description: 'Впевнені?',
      confirmationText: 'Так',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        const {data} = await addBlockToMarathon(marathon._id, {
          name: newTitle,
          description: newDescription,
          isFinalWeek
        });
        success({delay: 1000, text: 'Cтворенно!'});
        navigate('./../');
      })
      .catch(e => console.log('no ' + e));
  };

  return (
    <>
      <PlayerHeader />
      <div className={newBlockStyle.wrapper}>
        {
          <div>
            <div className={styles.block__wrapper}>
              <div className={styles.block__header}>{newTitle}</div>
              <div data-color-mode="light" className={styles.block__description}>
                <MDEditor.Markdown source={newDescription} style={{whiteSpace: 'pre-wrap'}} />
              </div>
            </div>
          </div>
        }
        <div className={newBlockStyle.input__wrapper}>
          {
            <>
              <label htmlFor="title">Заголовок</label>
              <input
                id="title"
                placeholder="Заголовок"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}></input>
              <label htmlFor="description">Опис</label>
              <MDEditor
                id="description"
                value={newDescription}
                onChange={setNewDescription}
                preview={'edit'}
              />
              <div className={styles.final__wrapper}>
                <span>Фінальний проєкт?</span>
                <input
                  className={styles.final__input}
                  type="checkbox"
                  value={isFinalWeek}
                  onChange={e => setIsFinalWeek(e.target.checked)}></input>
              </div>
            </>
          }
          {
            <button
              className={ButtonStyle.button}
              onClick={() => {
                confirmAndCreate();
              }}>
              Створити
            </button>
          }
        </div>
      </div>
    </>
  );
}
