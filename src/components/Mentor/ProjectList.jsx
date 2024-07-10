import React, {useEffect, useState} from 'react';

import {getProjectsFromBlock} from '../../helpers/marathon/marathon';
import getDomainOrExtension from '../../helpers/link_shredder';
import ChatComponent from '../Chat/ChatComponent';
import styles from './Utils.module.scss';

export default function ProjectList({marathonId, blockId}) {
  const [projects, setProjects] = useState([]);
  const fetchAllTeams = async () => {
    const res = await getProjectsFromBlock(marathonId, blockId);
    console.log(res);
    setProjects(res);
  };
  useEffect(() => {
    fetchAllTeams();
  }, []);
  console.log(projects);
  return (
    <>
      <div className={styles.project__wrapper}>
        {projects.length > 0 &&
          projects.map(project => {
            return (
              <div className={styles.project__card}>
                <div className={styles.project__card__header}>
                  <span>
                    Команда {project.team.leader.name} ({project.team.leader.email})
                  </span>
                  <span>{project.confirm ? 'Confirmed ✔️' : 'In progress🔄'}</span>
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
