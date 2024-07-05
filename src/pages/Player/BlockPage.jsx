import React, {useEffect, useState} from 'react';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useLocation, useParams} from 'react-router-dom';
import styles from './PlayerPage.module.scss';
import buttonStyles from '../../styles/Button.module.scss';
import {storage} from '../../helpers/firebase';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {useSelector} from 'react-redux';
import {getTeamAsMember} from '../../helpers/team/team';
import {
  createProjectToBlock,
  getProjectByTeamId,
  updateBlockProject
} from '../../helpers/marathon/marathon';
import fileSVG from '../../img/file.svg';
import getDomainOrExtension from '../../helpers/link_shredder';

export default function BlockPage() {
  const location = useLocation();
  const {marathon} = location.state;
  const {sprintId} = useParams() || null;
  const userId = useSelector(state => state.auth.user.id);
  const userName = useSelector(state => state.auth.user.name);
  const [block] = useState(marathon.blocks.filter(bl => bl._id === sprintId)[0]);
  const [files, setFiles] = useState(null);
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

  const uploadImage = async () => {
    if (files === null) return;

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
  };
  useEffect(() => {
    fetchMyTeam();
  }, []);
  useEffect(() => {
    if (myTeam) fetchMyProject();
  }, [myTeam]);
  // useEffect(() => {
  //   if (myTeam) {
  //     console.log(myTeam);
  //     patchOrCreateBlockProject({
  //       files: ['links'],
  //       block: block._id,
  //       marathon: marathon._id,
  //       team: myTeam._id
  //     });
  //   }
  // }, [myTeam]);
  const postProject = async () => {
    const {data} = await createProjectToBlock(marathon._id, block._id, {
      team: myTeam._id
    });
    console.log(data);
    setMyProject(data[0]);
  };
  const addLink = async () => {
    const data = await updateBlockProject(marathon._id, block._id, myProject._id, {
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
      <PlayerHeader></PlayerHeader>
      <div className={styles.block__wrapper}>
        <div className={styles.block__header}>{block.name}</div>
        <div className={styles.block__description}>{block.description}</div>
        {myProject ? (
          <>
            {myTeam.leader === userId && (
              <div className={styles.block__upload__grid}>
                <div className={styles.block__upload__wrapper}>
                  <input type="file" multiple onChange={e => setFiles(e.target.files)} />
                  <button
                    className={buttonStyles.button}
                    onClick={() => {
                      uploadImage();
                    }}>
                    Upload
                  </button>
                </div>
                <div className={styles.block__upload__link__wrapper}>
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
                    Завантажити
                  </button>
                </div>
              </div>
            )}
            <p className={styles.block__upload__header}> Завантажено:</p>
            <div className={styles.block__upload__grid}>
              <div>
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
              <div>
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
          <button
            className={buttonStyles.button}
            onClick={() => {
              postProject();
            }}>
            Хочеш здати? Натискай!
          </button>
        )}
      </div>
    </>
  );
}
