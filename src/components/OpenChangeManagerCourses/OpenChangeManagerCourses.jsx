import styles from "./OpenChangeManagerCourses.module.scss";

const OpenChangeManagerCourses = ({
  OpenChangeManagerCoursesFunc,
  curState,
}) => {
  return (
    <button
      className={styles.input__submit}
      onClick={(e) => {
        e.preventDefault();
        OpenChangeManagerCoursesFunc(!curState);
      }}
    >
      Courses
    </button>
  );
};

export default OpenChangeManagerCourses;
