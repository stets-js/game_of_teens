import React, { useState } from "react";
import styles from "./EditForm.module.scss";
import { useSelector } from "react-redux";
import {updateProject} from "../../helpers/project/project"

const EditForm = ({ item, onClose }) => {
    const userId = useSelector((state) => state.auth.user.id);
    console.log("item", item);
    const [formData, setFormData] = useState({
        projectId: item._id,
        jureId: userId,
        course: item.course,
        project_link: item.project_link,
        video_link: item.video_link,
        scores: item.jures[0]?.scores.map(score => ({ ...score, score: score.score || 0 })) || [],
        comment: item.jures[0]?.comment || '',
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
          onClose();
        } catch (error) {
          console.error("Помилка збереження даних:", error);
        }
      };

    const handleConfirm = () => {
        // Обробка підтвердження проекту
        console.log("Проект підтверджено:", formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label>
                Лінк на репозиторій:
                <input
                    type="url"
                    name="project_link"
                    value={formData.project_link}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Лінк на відео:
                <input
                    type="url"
                    name="video_link"
                    value={formData.video_link}
                    onChange={handleChange}
                    required
                />
            </label>
            {formData.scores.map((score, index) => (
                <label key={score.criteria}>
                    Оцінка {item.criterias.find(c => c._id === score.criteria).name}:
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
                <button className={styles.button__save} type="submit">Save</button>
                <button className={styles.button__confirm} type="button" onClick={handleConfirm}>Confirm project</button>
            </div>
        </form>
    );
};

export default EditForm;
