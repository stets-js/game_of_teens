import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./EditForm.module.scss";
import { updateProject, confirmProject } from "../../helpers/project/project";

const EditForm = ({ item, onClose, onUpdate }) => {
    console.log("item", item)

  const userId = useSelector((state) => state.auth.user.id);
  const userJure = item.jures.find((jure) => jure.jureId === userId);
  const [formData, setFormData] = useState({
    projectId: item._id,
    jureId: userId,
    course: item.course,
    project_link: item.project_link,
    video_link: item.video_link,
    scores: userJure ? userJure.scores.map((score) => ({ ...score, score: score.score || 0 })) : [],
    comment: userJure ? userJure.comment || '' : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScoreChange = (e, index) => {
    const { value } = e.target;
    if (value >= 0 && value <= 10) {
      const newScores = [...formData.scores];
      newScores[index].score = +value;
      setFormData({ ...formData, scores: newScores });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject(formData.projectId, formData);
      console.log("Збережені дані:", formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Помилка збереження даних:", error);
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmProject(formData.projectId);
      console.log("Проект підтверджено:", formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Помилка підтвердження проекту:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Лінк на репозиторій:
        <input
          type="text"
          name="project_link"
          value={formData.project_link}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Лінк на відео:
        <input
          type="text"
          name="video_link"
          value={formData.video_link}
          onChange={handleChange}
          required
        />
      </label>
      {formData.scores.map((score, index) => (
        <label key={score.criteria}>
          Оцінка {item.criterias.find((c) => c._id === score.criteria).name}:
          <input
            type="number"
            name={`score-${score.criteria}`}
            value={score.score}
            onChange={(e) => handleScoreChange(e, index)}
            min={0}
            max={10}
            required
          />
        </label>
      ))}
      <label>
        Коментар:
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
        />
      </label>
      <div className={styles.buttons}>
        <button className={styles.button__save} type="submit">
          Save
        </button>
        <button
          className={styles.button__confirm}
          type="button"
          onClick={handleConfirm}
        >
          Confirm project
        </button>
      </div>
    </form>
  );
};

export default EditForm;
