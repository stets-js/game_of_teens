import React, { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useSelector } from "react-redux";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import styles from "./JuryPage.module.scss";
import Select from "../../components/Select/Select";
import Table from "../../components/Table/Table";
import {getCourses} from "../../helpers/courses/courses";


export default function JuryPage() {
  const userName = useSelector((state) => state.auth.user.name);
  const [courseId, setCourses] = useState("");
  const [projects, setProjects] = useState([]);

  return (
    <>
      <Header
        endpoints={[]}
        user={{ name: {userName} }}
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
        <Table data={projects} />
      </section>
    </>
  );
}
