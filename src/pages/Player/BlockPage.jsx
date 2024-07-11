import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import {useConfirm} from 'material-ui-confirm';

import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useLocation, useParams} from 'react-router-dom';
import styles from './PlayerPage.module.scss';
import buttonStyles from '../../styles/Button.module.scss';
import {useSelector} from 'react-redux';
import {getTeamAsMember} from '../../helpers/team/team';
import {createProjectToBlock, getProjectByTeamId} from '../../helpers/marathon/marathon';
import MDEditor from '@uiw/react-md-editor';
import {error} from '@pnotify/core';
import ChatComponent from '../../components/Chat/ChatComponent';
import ProjectList from '../../components/Mentor/ProjectList';
import UploadFiles from '../../components/Block/UploadFiles';
import UploadedData from '../../components/Block/UploadedDate';

export default function BlockPage() {
  const location = useLocation();
  const {marathon} = location.state;
  const {sprintId} = useParams() || null;
  const userId = useSelector(state => state.auth.user.id);
  const userRole = useSelector(state => state.auth.user.role);
  const [block] = useState(marathon.blocks.filter(bl => bl._id === sprintId)[0]);
  // const [files, setFiles] = useState(null);
  const [myProject, setMyProject] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
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
                <UploadFiles
                  marathon={marathon}
                  blockId={block._id}
                  myProject={myProject}
                  setMyProject={setMyProject}
                />
              )}
              <UploadedData files={myProject.files} links={myProject.links}></UploadedData>
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
