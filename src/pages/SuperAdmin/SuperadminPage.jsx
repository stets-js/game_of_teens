import React, {useState, useEffect} from "react";
import styles from "./SuperAdminPage.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import { Outlet } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import Select from "../../components/Select/Select";
import {getCourses} from "../../helpers/courses/courses";
import {getProjectsByCourse} from "../../helpers/project/project";
import Table from "../../components/Table/Table";
import { startLoading, stopLoading } from '../../redux/loading/loading-actions';

const SuperAdministrator = () => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.auth.user.name);
  const [courseId, setCourses] = useState("");
  const [projects, setProjects] = useState([]);
  

  const fetchProjects = async (courseId) => {
    dispatch(startLoading());
    try {
      const res = await getProjectsByCourse(courseId);
      console.log("res.data.data", res.data.data)
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(stopLoading());
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
        user={{ name: {userName}}}
      />
      <section className={styles.main_wrapper}>
        <BgWrapper title="Super administrator" />
        <Select 
        classname={styles.select__label2}
        value={courseId}
        setValue={setCourses}
        request={getCourses}
        label="course"
        defaultValue="Select course"
        title="Course:"
        />
        <Table data={projects} />
      </section>
    </>
  );
};

export default SuperAdministrator;
