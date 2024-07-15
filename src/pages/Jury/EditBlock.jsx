import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { addBlockToMarathon, getAllMarathons, updateBlockById } from '../../helpers/marathon/marathon';
import styles from '../Player/PlayerPage.module.scss';
import newBlockStyle from './NewBlock.module.scss';
import ButtonStyle from '../../styles/Button.module.scss';
import { useConfirm } from 'material-ui-confirm';
import { success, error, defaults } from '@pnotify/core';
import { useLocation, useNavigate } from 'react-router-dom';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';

export default function EditBlock() {
  const confirm = useConfirm();
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);
  const { blockId, marathon_state, title = 'Title', description = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam dolor rem suscipit adipisci est iste excepturi incidunt sed.' } = location.state;
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  console.log("blockId", blockId);

  const confirmAndUpdate = async () => {
    try {
      await confirm({
        description: 'Впевнені?',
        confirmationText: 'Так',
        confirmationButtonProps: { autoFocus: true }
      });

      console.log('Updating block with:', { name: newTitle, description: newDescription, marathon:marathon_state, blockId:blockId });

      const data = await updateBlockById(marathon_state._id, blockId, {
        name: newTitle,
        description: newDescription
      });

      console.log('Update response:', data);

      success({ delay: 1000, text: 'Зміни збережено!' });
      navigate('./../');
    } catch (e) {
      console.error('Error updating block:', e);
      error({ delay: 1000, text: 'Помилка збереження змін' });
    }
  };

  return (
    <>
      <PlayerHeader />
      <div className={newBlockStyle.wrapper}>
        <div>
          <div className={styles.block__wrapper}>
            <div className={styles.block__header}>{newTitle}</div>
            <div data-color-mode="light" className={styles.block__description}>
              <MDEditor.Markdown source={newDescription} style={{ whiteSpace: 'pre-wrap' }} />
            </div>
          </div>
        </div>
        <div className={newBlockStyle.input__wrapper}>
          <label htmlFor="title">Заголовок</label>
          <input
            id="title"
            placeholder="Заголовок"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <label htmlFor="description">Опис</label>
          <MDEditor
            id="description"
            value={newDescription}
            onChange={setNewDescription}
            preview="edit"
          />
          <button
            className={ButtonStyle.button}
            onClick={confirmAndUpdate}
          >
            Зберегти зміни
          </button>
        </div>
      </div>
    </>
  );
}
