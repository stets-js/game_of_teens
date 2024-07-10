import React, {useEffect, useState} from 'react';
import {useConfirm} from 'material-ui-confirm';
import {success} from '@pnotify/core';

import {getProjectsFromBlock, updateBlockProject} from '../../helpers/marathon/marathon';
import getDomainOrExtension from '../../helpers/link_shredder';
import ChatComponent from '../Chat/ChatComponent';
import styles from './Utils.module.scss';
import buttonStyles from '../../styles/Button.module.scss';
export default function ProjectList({marathonId, blockId}) {
  const [projects, setProjects] = useState([]);

  const confirm = useConfirm();
  const fetchAllTeams = async () => {
    const res = await getProjectsFromBlock(marathonId, blockId);
    console.log(res);
    setProjects(res);
  };
  useEffect(() => {
    fetchAllTeams();
  }, []);
  const handleMentorCheck = async projectId => {
    confirm({
      description: 'Перевірили?',
      confirmationText: 'Так',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        const {data} = await updateBlockProject(marathonId, blockId, projectId, {
          checkedByMentor: true
        });
        success({delay: 1000, text: 'Перевіренно!'});
        fetchAllTeams();
        // setNewDescription(
        //   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        // );
        // setNewTitle('Title');
      })
      .catch(e => console.log('no ' + e));
  };
  return (
    <>
      <div className={styles.project__wrapper}>
        {projects.length > 0 &&
          projects.map(project => {
            return (
              <div key={project._id} className={styles.project__card}>
                <div className={styles.project__card__header}>
                  <span>
                    Команда {project.team.leader.name} ({project.team.leader.email})
                  </span>
                  <div className={styles.project__card__header__status}>
                    <span>{project.confirm ? 'Confirmed ✔️' : 'In progress🔄'}</span>
                    {project.confirm && project.checkedByMentor ? (
                      <p> Mentor Confirmed ✔️</p>
                    ) : (
                      <button
                        className={buttonStyles.button}
                        onClick={() => handleMentorCheck(project._id)}>
                        Перевірено
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.project__card__body}>
                  <div className={styles.project__card__members}>
                    <span>Members: </span>
                    <div className={styles.project__card__members__list}>
                      {project.team.members.map(member => (
                        <p>
                          {member.name} ({member.email})
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span>Files: </span>
                    {project.files.map((file, index) => (
                      <a href={file} rel="noreferrer" target="_blank">
                        {getDomainOrExtension(file)}
                        {index !== project.files.length - 1 ? ', ' : ''}
                      </a>
                    ))}
                  </div>
                  <div>
                    <span>Links:</span>
                    {project.links.map((link, index) => (
                      <a href={link} rel="noreferrer" target="_blank">
                        {' '}
                        {getDomainOrExtension(link)}{' '}
                        {index !== project.files.length - 1 ? ', ' : ''}
                      </a>
                    ))}
                  </div>
                </div>
                {project.confirm && (
                  <>
                    <p>Chat</p>
                    <ChatComponent
                      isMentor
                      marathonId={marathonId}
                      blockId={blockId}
                      projectId={project._id}></ChatComponent>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
}
