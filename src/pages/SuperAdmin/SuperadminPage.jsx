import React, {useState} from "react";
import styles from "./SuperAdminPage.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "../../components/Select/Select";
import {getCourses} from "../../helpers/courses/courses";
import Table from "../../components/Table/Table";

const SuperAdministrator = () => {
  const userName = useSelector((state) => state.auth.user.name);
  const [courseId, setCourses] = useState("");
  const [projects, setProjects] = useState([]);
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
