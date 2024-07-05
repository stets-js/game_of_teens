import React, {useEffect, useState} from 'react';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useLocation, useParams} from 'react-router-dom';
import styles from './PlayerPage.module.scss';
import buttonStyles from '../../styles/Button.module.scss';
import {storage} from '../../helpers/firebase';
import {ref, uploadBytes} from 'firebase/storage';
import {useSelector} from 'react-redux';

export default function BlockPage() {
  const location = useLocation();
  const {marathon} = location.state;
  const {sprintId} = useParams() || null;
  const userName = useSelector(state => state.auth.user.name);
  const [block] = useState(marathon.blocks.filter(bl => bl._id === sprintId)[0]);
  const [files, setFiles] = useState(null);
  console.log(files);
  const uploadImage = async () => {
    if (files === null) return;

    //
    const storageRef = ref(
      storage,
      (marathon.course.name + '/' || 'images/') + userName + files[0].name
    );
    const res = await uploadBytes(storageRef, files[0]);
    console.log(res);
  };
  return (
    <>
      <PlayerHeader></PlayerHeader>
      <div className={styles.block__wrapper}>
        <div className={styles.block__header}>{block.name}</div>
        <div className={styles.block__description}>{block.description}</div>
      </div>
      <input type="file" onChange={e => setFiles(e.target.files)} />
      <button
        className={buttonStyles.button}
        onClick={() => {
          uploadImage();
        }}>
        Google (dont click)
      </button>
    </>
  );
}
