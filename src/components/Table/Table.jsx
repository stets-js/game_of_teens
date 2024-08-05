import React, {useState, useEffect} from 'react';
import {Tooltip} from 'react-tooltip';

import {useSelector} from 'react-redux';
import styles from './Table.module.scss';
import NoData from '../NoData/NoData';
import {TailSpin} from 'react-loader-spinner';
import Modal from '../Modal/Modal';
import EditForm from '../EditForm/EditForm';
import getDomainOrExtension from '../../helpers/link_shredder';
import classNames from 'classnames';

export default function Table({data, selectedMarathon, onUpdate, admin}) {
  const userId = useSelector(state => state.auth.user.id);
  const loading = useSelector(state => state.load.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [sortedData, setSortedData] = useState([]);
  const [projects, setProjects] = useState(selectedMarathon?.finalWeek?.projects);
  const [criterias, setCriterias] = useState(selectedMarathon?.criterias);
  const [juries, setJuries] = useState(selectedMarathon?.juries);
  useEffect(() => {
    if (selectedMarathon?.finalWeek?.projects)
      setProjects(
        selectedMarathon?.finalWeek?.projects.filter(project => project.confirm === true)
      );
    if (selectedMarathon) {
      setCriterias(selectedMarathon?.criterias);
      setJuries(selectedMarathon?.juries);
    }
  }, [selectedMarathon]);

  const handleEdit = item => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    onUpdate(); // Викликаємо onUpdate при закритті модалки
  };
  useEffect(() => {
    if (admin) {
      const sortedProjects = selectedMarathon?.finalWeek.projects
        .slice()
        .sort((a, b) => b.totalScore - a.totalScore);
      setSortedData(sortedProjects);
    } else {
      setSortedData(
        selectedMarathon?.finalWeek.projects.filter(project => {
          const jury = project.juries.find(jury => jury.jureId === userId);
          return !jury || jury.confirmed !== true;
        })
      );
    }
  }, [selectedMarathon, admin, userId]);
  const renderAdminTable = () => (
    <div className={styles.table}>
      <div className={styles.thead}>
        <div className={styles.tr}>
          <div className={styles.th}>Ім'я</div>
          <div className={styles.th}>Лінки</div>
          {criterias.map(criteria => (
            <div key={criteria._id} className={styles.th} colSpan={juries.length + 1}>
              {criteria.name}
              <div className={styles.subthead}>
                {juries.map(jure => (
                  <div
                    key={`${criteria._id}-${jure.jureId}`}
                    className={styles.th}
                    data-tooltip-id={`${criteria._id}-${jure.jureId}`}
                    data-tooltip-content={jure.name}>
                    {(() => {
                      const fullName = jure.name.split(' ');
                      if (fullName.length > 1) return `${fullName[0][0]}.${fullName[1][0]}`;
                      return jure.name;
                    })()}
                    <Tooltip id={`${criteria._id}-${jure.jureId}`} />
                  </div>
                ))}
                <div className={styles.th}>Середня</div>
              </div>
            </div>
          ))}
          <div className={styles.th}>Total</div>
          <div className={styles.th}>Місце</div>
        </div>
      </div>
      <div className={styles.tbody}>
        {sortedData &&
          sortedData.map((project, index) => {
            if (!project) return <></>;
            const total = project.totalScore;
            return (
              <div key={project._id} className={styles.tr}>
                <div className={styles.td}>
                  {project.team.leader.name} team ({project.team.members.length})
                </div>
                <div className={styles.td}>
                  {(project.links || []).map(link => {
                    // !TODO: remove || after deleting all test data
                    return (
                      <div>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          {getDomainOrExtension(link)}
                        </a>
                      </div>
                    );
                  })}
                </div>
                {criterias.map(criteria => {
                  const avg = project?.avgScores.find(avg => avg.criteria === criteria._id);
                  console.log(avg);
                  return (
                    <React.Fragment key={criteria._id}>
                      <div className={styles.tc}>
                        {juries.map(jure => {
                          const jureScore = project.juries.find(js => js.jureId === jure._id);
                          if (!jureScore)
                            return (
                              <div key={`${criteria._id}-${jure.jureId}`} className={styles.td}>
                                N/A
                              </div>
                            );
                          const score =
                            jureScore.scores.find(score => score.criteria === criteria._id)
                              ?.score || 'N/A';
                          return (
                            <div key={`${criteria._id}-${jure.jureId}`} className={styles.td}>
                              {score}
                            </div>
                          );
                        })}
                        <div className={styles.td}>{avg ? avg.avgScore.toFixed(2) : 'N/A'}</div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div className={styles.td}>{total.toFixed(2)}</div>
                <div className={classNames(styles.td, styles.td__last)}>{index + 1}</div>
              </div>
            );
          })}
      </div>
    </div>
  );

  const renderUserTable = () => (
    <div className={styles.table}>
      <div className={styles.thead}>
        <div className={styles.tr}>
          <div className={styles.th}>Ім'я</div>
          <div className={styles.th}>Команда</div>
          {/* { <div className={styles.th}>Лінк на репозиторій</div>
          <div className={styles.th}>Лінк на відео</div>} */}
          <div className={styles.th}>Лінки</div>
          <div className={styles.th}>Файли</div>
          <div className={styles.th}>Відео/опис</div>
          {criterias.map(criteria => (
            <div key={criteria._id} className={styles.th}>
              {criteria.name}
            </div>
          ))}
          <div className={styles.th}>Коментар ментора</div>
          <div className={styles.th}>Оцінити</div>
        </div>
      </div>
      <div className={styles.tbody}>
        {sortedData.map(project => {
          const userJure = project.juries.find(jure => jure.jureId === userId);
          return (
            <div key={project._id} className={styles.tr}>
              <div className={styles.td}>{project.team.leader.name} team</div>
              <div className={styles.td}>{project.team.members.length}</div>

              <div className={styles.td}>
                {(project.links || []).map(link => {
                  // !TODO: remove || after deleting all test data
                  return (
                    <div>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {getDomainOrExtension(link)}
                      </a>
                    </div>
                  );
                })}
              </div>
              <div className={styles.td}>
                {(project.files || []).map(file => {
                  return (
                    <div>
                      <a href={file} target="_blank" rel="noopener noreferrer">
                        {getDomainOrExtension(file)}
                      </a>
                    </div>
                  );
                })}
              </div>
              <div className={styles.td}>
                {project?.finalVideo ? (
                  <>
                    <span>
                      <a href={project?.finalVideo.link} target="_blank" rel="noopener noreferrer">
                        {getDomainOrExtension(project?.finalVideo.link)}
                      </a>
                      <div>{project?.finalVideo.description}</div>
                    </span>
                  </>
                ) : (
                  'Немає'
                )}
              </div>
              {criterias.map((criteria, index) => {
                const score = userJure
                  ? userJure.scores.find(score => score.criteria === criteria._id)?.score
                  : 'N/A';
                return (
                  <div key={`${criteria._id}-${index}`} className={styles.td}>
                    {score}
                  </div>
                );
              })}
              <div className={styles.td}>{project?.mentorComment?.text || 'Немає'}</div>
              <div className={styles.td}>
                <button onClick={() => handleEdit(project)} className={styles.btn__edit}>
                  Оцінити
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <EditForm
            criterias={criterias}
            marathonId={selectedMarathon.value}
            item={currentItem}
            onClose={closeModal}
            onUpdate={onUpdate}
          />
        </Modal>
      )}
      <div className={styles.table__wrapper}>
        {loading ? (
          <div className={styles.spinner}>
            <TailSpin height="130px" width="130px" color="#999DFF" />
          </div>
        ) : (
          <>
            {(projects || [])?.length === 0 ? (
              window.innerWidth <= 600 ? (
                <p className={styles.table__emptyText}>NO DATA AVAILABLE</p>
              ) : (
                <div className={styles.table__emptyImg}>
                  <NoData />
                </div>
              )
            ) : admin ? (
              renderAdminTable()
            ) : (
              renderUserTable()
            )}
          </>
        )}
      </div>
    </>
  );
}
