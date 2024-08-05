// This is analog of table from teaching booking, but using table
import React, {useEffect, useState} from 'react';
import {format} from 'date-fns';

import tableStyles from './TableTeaching.module.scss';
import classNames from 'classnames';
import {useSelector} from 'react-redux';
import {Tooltip} from 'react-tooltip';
import TableHeader from './TableHeader';
import getDomainOrExtension from '../../helpers/link_shredder';

export default function TableBody({selectedMarathon, onUpdate, admin}) {
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
  const outerOrInnerCell = (index, notFirstRow = false) => {
    if (notFirstRow && index === 0) return tableStyles.cell__inner;
    return index === projects.length - 1 ? tableStyles.cell__outer : tableStyles.cell__inner;
  };
  return (
    <>
      <div className={classNames(tableStyles.calendar, tableStyles.scroller)}>
        <table className={tableStyles.tableBody}>
          <tbody>
            <TableHeader juries={juries} projects={projects} criterias={criterias}></TableHeader>
            {sortedData &&
              sortedData.map((project, index) => {
                const total = project.totalScore;
                return (
                  <tr key={'header'}>
                    <td>
                      <div className={classNames(tableStyles.cell, outerOrInnerCell(index, true))}>
                        {project.team.leader.name} team ({project.team.members.length})
                      </div>
                    </td>
                    <td>
                      <div
                        className={classNames(
                          tableStyles.cell,

                          outerOrInnerCell(index, true)
                        )}>
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
                    </td>
                    <td>
                      <div
                        className={classNames(
                          tableStyles.cell,

                          outerOrInnerCell(index, true)
                        )}>
                        {(project.files || []).map(file => {
                          // !TODO: remove || after deleting all test data
                          return (
                            <div>
                              <a href={file} target="_blank" rel="noopener noreferrer">
                                {getDomainOrExtension(file)}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td>
                      <div
                        className={classNames(
                          tableStyles.cell,

                          outerOrInnerCell(index, true)
                        )}>
                        <a
                          href={project?.finalVideo?.link}
                          target="_blank"
                          rel="noopener noreferrer">
                          {getDomainOrExtension(project?.finalVideo?.link)}
                        </a>
                        <div>{project?.finalVideo?.description}</div>
                      </div>
                    </td>
                    <td>
                      <div
                        className={classNames(
                          tableStyles.cell,

                          outerOrInnerCell(index, true)
                        )}>
                        <div>{project?.mentorComment?.text}</div>
                      </div>
                    </td>
                    {criterias.map(criteria => {
                      const avg =
                        project.avgScores.length > 0
                          ? (project?.avgScores || []).find(avg => avg.criteria === criteria._id)
                          : 'N/a';

                      return (
                        <>
                          <td colSpan={juries.length + 1}>
                            <div
                              className={classNames(
                                tableStyles.cell,

                                outerOrInnerCell(index, true)
                              )}>
                              <div className={tableStyles.cell__subCell}>
                                {juries.map(jure => {
                                  const jureScore = project.juries.find(
                                    js => js.jureId === jure._id
                                  );
                                  if (!jureScore)
                                    return (
                                      <div
                                        key={`${criteria._id}-${jure.jureId}`}
                                        className={tableStyles.cell__subCell__item}>
                                        N/A
                                      </div>
                                    );
                                  const score =
                                    jureScore.scores.find(score => score.criteria === criteria._id)
                                      ?.score || 'N/A';
                                  return (
                                    <div
                                      key={`${criteria._id}-${jure.jureId}`}
                                      className={tableStyles.cell__subCell__item}>
                                      {score}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                          <td colSpan={juries.length + 1}>
                            <div
                              className={classNames(
                                tableStyles.cell,
                                tableStyles.cell__avg,
                                outerOrInnerCell(index, true)
                              )}>
                              {avg.avgScore}
                            </div>
                          </td>
                        </>
                      );
                    })}
                    <td>
                      <div
                        className={classNames(
                          tableStyles.cell,

                          outerOrInnerCell(index, true)
                        )}>
                        {total}
                      </div>
                    </td>
                    <td>
                      <div
                        className={classNames(
                          tableStyles.cell,

                          outerOrInnerCell(index, true)
                        )}>
                        {index + 1}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}
