import React, {useEffect, useState} from 'react';
import {useConfirm} from 'material-ui-confirm';
import {success} from '@pnotify/core';

import {getProjectsFromBlock, updateBlockProject} from '../../helpers/marathon/marathon';
import getDomainOrExtension from '../../helpers/link_shredder';
import ChatComponent from '../Chat/ChatComponent';
import styles from './Utils.module.scss';
import buttonStyles from '../../styles/Button.module.scss';
import {useSelector} from 'react-redux';

export default function ProjectList({marathonId, blockId, isFinalWeek = false}) {
  const [projects, setProjects] = useState([]);
  const userId = useSelector(state => state.auth.user.id);
  const [comment, setComment] = useState({flag: -1, text: '', author: userId});
  const confirm = useConfirm();
  const fetchAllTeams = async () => {
    const res = await getProjectsFromBlock(marathonId, blockId);
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

  const sendComment = async projectId => {
    const res = await updateBlockProject(marathonId, blockId, projectId, {
      mentorComment: {text: comment.text, author: userId}
    });
    if (res) {
      fetchAllTeams();
      setComment({flag: -1, text: '', author: userId});
      success('Коментар залишено!');
    }
  };

  console.log(comment);
  return (
    <>
      <div className={styles.project__wrapper}>
        {projects.length > 0 &&
          projects.map((project, index) => {
            return (
              <div key={project._id} className={styles.project__card}>
                <div className={styles.project__card__header}>
                  <span>
                    Команда {project?.team?.leader?.name} ({project.team?.leader?.email})
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
                      {project.team &&
                        project.team.members &&
                        project.team.members.length > 0 &&
                        project.team.members.map(member => (
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
                  {isFinalWeek && project.finalVideo && (
                    <>
                      <span>Video:</span>
                      <div className={styles.project__card__final}>
                        <div>
                          <a href={project?.finalVideo?.link} alt="link">
                            {project?.finalVideo?.link}
                          </a>
                        </div>
                        <div>{project?.finalVideo?.description}</div>
                      </div>
                    </>
                  )}
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
                {isFinalWeek && (
                  <>
                    <hr></hr>
                    <h3>Залишити коментар(для журі)</h3>
                    {project.mentorComment &&
                    project.mentorComment.text &&
                    comment.flag !== index ? (
                      <div className={styles.comment__wrapper}>
                        <textarea
                          className={styles.comment__textarea}
                          value={project.mentorComment.text}
                          disabled
                          onChange={e => {
                            setComment(prev => {
                              return {...prev, text: e.target.value};
                            });
                          }}
                          placeholder="Відправити коментар">
                          {comment.text}
                        </textarea>
                        <button
                          className={buttonStyles.button}
                          onClick={async () => {
                            setComment({...project?.mentorComment, flag: index});
                          }}>
                          Оновити
                        </button>
                      </div>
                    ) : comment.flag === index ? (
                      <div className={styles.comment__wrapper}>
                        <textarea
                          className={styles.comment__textarea}
                          value={comment.text}
                          onChange={e => {
                            setComment(prev => {
                              return {...prev, text: e.target.value};
                            });
                          }}
                          placeholder="Відправити коментар">
                          {comment.text}
                        </textarea>
                        <button
                          className={buttonStyles.button}
                          onClick={async () => sendComment(project._id)}>
                          Відправити
                        </button>
                      </div>
                    ) : (
                      <button
                        className={buttonStyles.button}
                        onClick={async () => {
                          setComment({...project?.mentorComment, flag: index});
                        }}>
                        Залишити коментар
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
}
