import React, { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useSelector, useDispatch } from "react-redux";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import styles from "./JuryPage.module.scss";
import Select from "../../components/Select/Select";
import Table from "../../components/Table/Table";
import { getCourses } from "../../helpers/courses/courses";
import { getProjectsByCourse, confirmAllProjects } from "../../helpers/project/project";
import { startLoading, stopLoading } from '../../redux/loading/loading-actions';

export default function JuryPage() {
  const userName = useSelector((state) => state.auth.user.name);
  const userId = useSelector((state) => state.auth.user.id);
  const dispatch = useDispatch();
  const [courseId, setCourses] = useState("");
  const [projects, setProjects] = useState([]);
  
  console.log("projects",projects)

  const fetchProjects = async (courseId) => {
    dispatch(startLoading());
    try {
      const res = await getProjectsByCourse(courseId);
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleConfirm = async () => {
    try {
      const filteredProjects = projects.filter(project => {
        const jury = project.jures.find(jure => jure.jureId === userId);
        return jury && jury.scores.every(score => score.score > 0);
      });

      const formData = { projects: filteredProjects };
      await confirmAllProjects(formData);
      console.log("Проекти підтверджено");
      fetchProjects(courseId); // Викликати для оновлення списку проєктів після підтвердження
    } catch (error) {
      console.error("Помилка підтвердження проєкту:", error);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchProjects(courseId);
    }
  }, [courseId]);

  return (
    <>
      <Header
        endpoints={[]}
        user={{ name: userName }}
      />
      <section className={styles.main_wrapper}>
        <BgWrapper title="Jury Page" />
        <Select
          classname={styles.select__label2}
          value={courseId}
          setValue={setCourses}
          request={getCourses}
          label="course"
          defaultValue="Select course"
          title="Course:"
        />
        <Table data={projects} onUpdate={() => fetchProjects(courseId)} />
        <button
          className={styles.button__confirm}
          type="button"
          onClick={handleConfirm}
        >
          Confirm all projects
        </button>
      </section>
    </>
  );
}
