import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import {useConfirm} from 'material-ui-confirm';

import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useLocation, useParams} from 'react-router-dom';
import styles from './PlayerPage.module.scss';
import buttonStyles from '../../styles/Button.module.scss';
import {storage} from '../../helpers/firebase';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {useSelector} from 'react-redux';
import {getTeamAsMember} from '../../helpers/team/team';
import {
  confirmProjectToBlock,
  createProjectToBlock,
  getProjectByTeamId,
  updateBlockProject
} from '../../helpers/marathon/marathon';
import fileSVG from '../../img/file.svg';
import getDomainOrExtension from '../../helpers/link_shredder';
import MDEditor from '@uiw/react-md-editor';
import {defaults, error, success} from '@pnotify/core';
import ChatComponent from '../../components/Chat/ChatComponent';
import ProjectList from '../../components/Mentor/ProjectList';

export default function BlockPage() {
  const location = useLocation();
  const confirm = useConfirm();
  const {marathon} = location.state;
  const {sprintId} = useParams() || null;
  const userId = useSelector(state => state.auth.user.id);
  const userName = useSelector(state => state.auth.user.name);
  const userRole = useSelector(state => state.auth.user.role);
  const [block] = useState(marathon.blocks.filter(bl => bl._id === sprintId)[0]);
  // const [files, setFiles] = useState(null);
  const [myProject, setMyProject] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
  const [newLink, setNewLink] = useState(null);
  const fetchMyProject = async () => {
    try {
      const data = await getProjectByTeamId(marathon._id, block._id, myTeam._id);
      if (data) setMyProject(data);
    } catch (error) {}
  };

  const fetchMyTeam = async () => {
    const {data} = await getTeamAsMember(userId, marathon._id);
    setMyTeam(data.data[0]);
  };

  const uploadImage = async files => {
    console.log('clicked', files);
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
    console.log(links);
    const res = await updateBlockProject(marathon._id, block._id, myProject._id, {files: links});
    console.log(res);
    setMyProject(res);
  };
  useEffect(() => {
    if (userRole === 2) fetchMyTeam();
  }, [userRole]);
  useEffect(() => {
    if (myTeam) fetchMyProject();
  }, [myTeam]);

  const postProject = async () => {
    if (myTeam.leader._id !== userId) {
      return error({text: 'Лише лідер може це зробити', delay: 1000});
    }
    const {data} = await createProjectToBlock(marathon._id, block._id, {
      team: myTeam._id
    });
    setMyProject(data);
  };
  const addLink = async () => {
    if (!newLink) return;
    const data = await updateBlockProject(marathon._id, block._id, myProject._id, {
      links: [...(myProject.links || []), newLink]
    });
    console.log(data);
    if (data) {
      setMyProject(data);
      setNewLink(null);
    }
  };

  const confirmProject = async () => {
    confirm({
      description: `Впевнені що завершити здачу?`,
      confirmationText: 'Так',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        const data = await confirmProjectToBlock(marathon._id, block._id, myProject._id);
        setMyProject(data);
      })
      .catch(e => console.log('no ' + e));
  };
  return (
    <>
      <PlayerHeader></PlayerHeader>
      <div className={styles.block__wrapper}>
        <div className={styles.block__header}>{block.name}</div>
        {myProject && myProject.confirm && (
          <p className={classNames(styles.confirmed, styles.checkedByMentor)}>Здано ✔️</p>
        )}
        {myProject && myProject.checkedByMentor && (
          <p className={styles.checkedByMentor}>Перевірено ментором ✔️</p>
        )}
        <div data-color-mode="light" className={styles.block__description}>
          <MDEditor.Markdown
            mode="light"
            source={block.description}
            style={{whiteSpace: 'pre-wrap'}}
          />
        </div>
        {userRole === 2 &&
          (myProject ? (
            <>
              {myTeam && !myProject.confirm && myTeam?.leader?._id === userId && (
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
                      className={classNames(
                        styles.block__upload__link,
                        styles.block__upload__file__input
                      )}
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
                  <button
                    onClick={() => {
                      confirmProject();
                    }}
                    className={classNames(
                      buttonStyles.button,
                      styles.block__upload__grid__fullrow
                    )}>
                    Підтвердити здачу
                  </button>
                </div>
              )}

              <p className={styles.block__upload__header}> Завантажено:</p>
              <div className={styles.block__upload__grid}>
                <div className={styles.block__upload__card__wrapper}>
                  {myProject.files.map(file => {
                    const splited = file.split('.');
                    const ext = file.split('.')[splited.length - 1].split('?')[0];
                    const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
                    return (
                      <div className={styles.block__upload__card}>
                        <img
                          src={imageExt.includes(ext) ? file : fileSVG}
                          alt="file"
                          className={styles.block__upload__icons}
                        />
                        <a href={file}>{ext}</a>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.block__upload__grid__border}>
                  {myProject.links.map(link => {
                    const shortening = getDomainOrExtension(link);
                    return (
                      <div className={styles.block__upload__card}>
                        <a href={link}>{shortening}</a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {myTeam && (
                <button
                  className={buttonStyles.button}
                  onClick={() => {
                    postProject();
                  }}>
                  Хочеш здати? Натискай!
                </button>
              )}
            </>
          ))}
      </div>
      {myProject && myProject.confirm && (
        <ChatComponent
          chat={myProject.chat}
          leader={myTeam.leader._id}
          marathonId={marathon._id}
          blockId={block._id}
          projectId={myProject._id}
        />
      )}
      {userRole === 3 && <ProjectList marathonId={marathon._id} blockId={block._id}></ProjectList>}
    </>
  );
}
