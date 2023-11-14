import styles from "./ChangeManagerCourses.module.scss";
import Modal from "../../Modal/Modal";
import React, { useState, useEffect } from "react";
import {
  getManagerCourses,
  postManagerCourses,
} from "../../../helpers/course/course";
import { info, success, error } from "@pnotify/core";

const ChangeManagerCourses = ({ isOpen, handleClose, managerId }) => {
  const [managerCourses, setManagerCourses] = useState([]);
  const [activeCourseIds, setActiveCourseIds] = useState([]);
  const [managerInfo, setManagerInfo] = useState([]);
  useEffect(() => {
    getManagerCourses(managerId)
      .then((res) => {
        setManagerCourses(res.courses);
        setManagerInfo(res.manager);
        const activeIds = res.courses
          .filter((course) => course.is_active)
          .map((course) => course.id);
        setActiveCourseIds(activeIds);
      })
      .catch((error) => {
        // Handle the error here
        console.error(error);
      });
  }, [managerId]);

  const handleCheckboxChange = (courseId) => {
    setManagerCourses((prevCourses) =>
      prevCourses.map((course) => {
        if (course.id === courseId) {
          const updatedCourse = {
            ...course,
            is_active: !course.is_active,
          };

          if (updatedCourse.is_active) {
            setActiveCourseIds((prevIds) => [...prevIds, courseId]);
          } else {
            setActiveCourseIds((prevIds) =>
              prevIds.filter((id) => id !== courseId)
            );
          }

          return updatedCourse;
        }
        return course;
      })
    );
  };

  const handleSave = () => {
    const coursesList = activeCourseIds.join(" ");
    const data = new FormData();
    data.append("courses", coursesList);
    postManagerCourses(managerId, data)
      .then((response) => {
        success("Courses successfully updated");
        handleClose();
      })
      .catch((error) => {
        // Handle the error here
        console.error(error);
        error("Something went wrong");
      });
  };

  return (
    <>
      <Modal open={isOpen} onClose={handleClose}>
        <h1 className={styles.title}>Manager courses</h1>
        <h3 className={styles.managerLinkTitle}>
          Manager :{" "}
          <a
            className={styles.managerLink}
            href={`/manager/${managerInfo.id}/planning`}
          >
            {managerInfo.name}
          </a>
        </h3>
        <div className={styles.coursesBox}>
          {managerCourses.map((course) => (
            <div key={course.id} className={styles.checkBoxDiv}>
              <label className={styles.checkBoxLabel}>
                <input
                  className={styles.checkBox}
                  type="checkbox"
                  checked={course.is_active}
                  onChange={() => handleCheckboxChange(course.id)}
                />
                {course.name}
              </label>
            </div>
          ))}
        </div>
        <button className={styles.input__submit} onClick={handleSave}>
          Save
        </button>
      </Modal>
    </>
  );
};

export default ChangeManagerCourses;
