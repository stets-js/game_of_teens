import classNames from 'classnames';
import React, {useState} from 'react';

import styles from '../../pages/Player/PlayerPage.module.scss';
import buttonStyles from '../../styles/Button.module.scss';
import {storage} from '../../helpers/firebase';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {useSelector} from 'react-redux';
import {updateBlockProject} from '../../helpers/marathon/marathon';
import ConfirmProject from './ConfirmProject';

export default function UploadFiles({marathon, blockId, myProject, setMyProject}) {
  const userName = useSelector(state => state.auth.user.name);
  // const [files, setFiles] = useState(null);
  const [newLink, setNewLink] = useState(null);

  const uploadImage = async files => {
    if (files === null || files === undefined) return;

    //
    const links = await Promise.all(
      Object.values(files).map(async (file, index) => {
        const storageRef = ref(
          storage,
          (marathon.course.name + '/' || 'images/') + userName + index + file.name
        );
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      })
    );
    const res = await updateBlockProject(marathon._id, blockId, myProject._id, {files: links});
    setMyProject(res);
  };

  const addLink = async () => {
    if (!newLink) return;
    const data = await updateBlockProject(marathon._id, blockId, myProject._id, {
      links: [...(myProject.links || []), newLink]
    });
    console.log(data);
    if (data) {
      setMyProject(data);
      setNewLink(null);
    }
  };

  return (
    <>
      <div className={styles.block__upload__grid}>
        <div className={styles.block__upload__wrapper}>
          <input
            type="file"
            multiple
            id="hidden-file-input"
            onChange={e => {
              // const selectedFiles = e.target.files;
              // setFiles(selectedFiles);

              uploadImage(e.target.files);
            }}
            className={classNames(styles.block__upload__link, styles.block__upload__file__input)}
          />
          <button
            className={classNames(buttonStyles.button, styles.block__flex)}
            onClick={() => {
              document.getElementById('hidden-file-input').click();
              uploadImage();
            }}>
            Завантажити файл
          </button>
        </div>
        <div
          className={classNames(
            styles.block__upload__link__wrapper,
            styles.block__upload__grid__border
          )}>
          <input
            placeholder="Посилання"
            className={styles.block__upload__link}
            value={newLink}
            key={Math.random() * 100 - 1}
            onChange={e => setNewLink(e.target.value)}></input>
          <button
            className={buttonStyles.button}
            onClick={() => {
              addLink(newLink);
            }}>
            Додати
          </button>
        </div>
        <ConfirmProject
          marathon={marathon}
          blockId={blockId}
          projectId={myProject._id}
          setMyProject={setMyProject}
        />
      </div>
    </>
  );
}
