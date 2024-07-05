import React, {useEffect, useState} from 'react';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useLocation, useParams} from 'react-router-dom';
import styles from './PlayerPage.module.scss';
import buttonStyles from '../../styles/Button.module.scss';
import {storage} from '../../helpers/firebase';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {useSelector} from 'react-redux';
import {
  getMyBlockProject,
  patchOrCreateBlockProject
} from '../../helpers/block-project/block-project';
import {getTeamAsMember} from '../../helpers/team/team';
import {createProjectToBlock, getProjectByTeamId} from '../../helpers/marathon/marathon';

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

  const fetchMyProject = async () => {
    try {
      const data = await getProjectByTeamId(marathon._id, block._id, myTeam._id);
      console.log(data);
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
  };
  useEffect(() => {
    fetchMyTeam();
  }, []);
  useEffect(() => {
    if (myTeam) fetchMyProject();
  }, [myTeam]);
  console.log(myTeam);
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
  return (
    <>
      <PlayerHeader></PlayerHeader>
      <div className={styles.block__wrapper}>
        <div className={styles.block__header}>{block.name}</div>
        <div className={styles.block__description}>{block.description}</div>
        {myProject ? (
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
        ) : (
          <button
            className={buttonStyles.button}
            onClick={() => {
              postProject();
            }}>
            Хочеш сдати? Натискай!
          </button>
        )}
      </div>
    </>
  );
}
