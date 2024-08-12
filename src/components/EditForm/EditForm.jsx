import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {success} from '@pnotify/core';
import styles from './EditForm.module.scss';

import {updateProject, createScores} from '../../helpers/project/project';
import getDomainOrExtension from '../../helpers/link_shredder';

const EditForm = ({item, criterias, marathonId, onClose, onUpdate}) => {
  const userId = useSelector(state => state.auth.user.id);
  const [userJure, setUserJure] = useState(item?.juries?.find(jure => jure.jureId === userId));
  const addSchemaToProject = async () => {
    const res = await createScores({projectId: item._id, marathonId});
    setUserJure(res.newJure);
  };
  useEffect(() => {
    if (!userJure) {
      addSchemaToProject();
    }
  }, [userJure, item._id]);
  const [formData, setFormData] = useState({
    projectId: item._id,
    jureId: userId,
    course: item.course,
    project_link: item.project_link,
    video_link: item.video_link,
    links: item.links,
    files: item.files,
    video: item?.finalVideo?.link,

    marathonId,
    scores: userJure ? userJure.scores.map(score => ({...score, score: score.score || 0})) : [],
    comment: userJure ? userJure.comment || '' : ''
  });
  useEffect(() => {
    setFormData({
      projectId: item._id,
      jureId: userId,
      course: item.course,
      project_link: item.project_link,
      video_link: item.video_link,
      links: item.links,
      files: item.files,
      video: item?.finalVideo?.link,
      marathonId,
      scores: userJure ? userJure.scores.map(score => ({...score, score: score.score || 0})) : [],
      comment: userJure ? userJure.comment || '' : ''
    });
  }, [item, marathonId, userId, userJure]);
  const handleChange = e => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleScoreChange = (e, criteria) => {
    const {value} = e.target;
    if (value >= 0 && value <= 10) {
      const newScores = [
        ...formData.scores.map(scoreObj => {
          if (criteria._id === scoreObj.criteria) return {...scoreObj, score: +value};
          return scoreObj;
        })
      ];
      console.log(newScores);

      // newScores[index].score = +value;
      setFormData({...formData, scores: newScores});
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      success('Дані збережено!');
      await updateProject(formData.projectId, formData);
      console.log('Збережені дані:', formData);
      await onUpdate();
      onClose();
    } catch (error) {
      console.error('Помилка збереження даних:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Лінки:
        <div>
          {(formData.links || []).map(link => {
            return (
              <div key={link} className={styles.link__wrapper}>
                <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {(() => {
                    const extention = link.split('.');
                    return extention[extention.length - 1];
                  })()}
                </a>
              </div>
            );
          })}
        </div>
      </label>
      <label>
        Файли:
        <div>
          {(formData.files || []).map(file => {
            return (
              <div key={file} className={styles.link__wrapper}>
                <a href={file} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {getDomainOrExtension(file)}
                </a>
              </div>
            );
          })}
        </div>
      </label>
      {formData.video && (
        <label>
          Відео:
          <div>
            <div key={formData.video} className={styles.link__wrapper}>
              <a
                href={formData.video}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}>
                {getDomainOrExtension(formData.video)}
              </a>
            </div>
          </div>
        </label>
      )}

      {criterias.map((criteria, index) => (
        <label key={criteria._id}>
          Оцінка {criteria.name}:
          <input
            type="number"
            name={`score-${criteria.name}`}
            value={formData.scores.find(score => score.criteria === criteria._id)?.score}
            onChange={e => handleScoreChange(e, criteria)}
            min={0}
            max={10}
            required
          />
        </label>
      ))}
      <label>
        Коментар:
        <textarea name="comment" value={formData.comment} onChange={handleChange} />
      </label>
      <div className={styles.buttons}>
        <button className={styles.button__save} type="submit">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditForm;
