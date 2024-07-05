import React, {useEffect, useState} from 'react';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useLocation, useParams} from 'react-router-dom';
import styles from './PlayerPage.module.scss';
import useDrivePicker from 'react-google-drive-picker';
import buttonStyles from '../../styles/Button.module.scss';
export default function BlockPage() {
  const location = useLocation();
  const {marathon} = location.state;
  const {sprintId} = useParams() || null;
  const [openPicker, data, authResponse] = useDrivePicker();
  const handleOpenPicker = () => {
    openPicker({
      clientId: '',
      developerKey: '',
      viewId: 'DOCS',
      token: '',
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: false,
      multiselect: true
    });
  };
  useEffect(() => {
    if (data) {
      data.docs.map(element => console.log(element));
    }
  }, [data]);
  const [block] = useState(marathon.blocks.filter(bl => bl._id === sprintId)[0]);
  return (
    <>
      <PlayerHeader></PlayerHeader>
      <div className={styles.block__wrapper}>
        <div className={styles.block__header}>{block.name}</div>
        <div className={styles.block__description}>{block.description}</div>
      </div>
      <button
        className={buttonStyles.button}
        onClick={() => {
          handleOpenPicker();
        }}>
        Google (dont click)
      </button>
    </>
  );
}
