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
import {useLocation} from 'react-router-dom';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';

export default function AddNewBlock() {
  const confirm = useConfirm();
  const location = useLocation();

  const [allMarathons, setAllMarathons] = useState([]);
  console.log(location);
  const {marathon} = location.state;
  const [newTitle, setNewTitle] = useState('Title');
  const [newDescription, setNewDescription] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  );
  const fetchAllMarathons = async () => {
    const {data} = await getAllMarathons();
    setAllMarathons(
      data.data.map(marathon => {
        return {label: marathon.course.name, value: marathon._id, ...marathon};
      })
    );
  };

  useEffect(() => {
    fetchAllMarathons();
  }, []);
  const confirmAndCreate = async () => {
    confirm({
      description: 'Впевнені?',
      confirmationText: 'Так',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        const {data} = await addBlockToMarathon(marathon._id, {
          name: newTitle,
          description: newDescription
        });
        success({delay: 1000, text: 'Cтворенно!'});
        setNewDescription(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        );
        setNewTitle('Title');
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
              <div className={styles.block__description}>
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
      {/* {selectedMarathon && selectedMarathon.blocks && (
        <>
          <h1>Вже існуючі завдання</h1>
          {selectedMarathon.blocks.map(block => (
            <div className={styles.block__wrapper}>
              <div className={styles.block__header}>{block.name}</div>
              <div className={styles.block__description}>{block.description}</div>
            </div>
          ))}{' '}
        </>
      )} */}
    </>
  );
}
