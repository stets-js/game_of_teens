import React, { useState, useEffect } from "react";
import moment from "moment";
import styles from "./DayDatePicker.module.scss";
import { Fade } from "react-awesome-reveal";

const DayDatePicker = ({ tableDate, changeDateFn, selectedTeam }) => {
  const [date, setDate] = useState(new Date(tableDate));

  const month = date.getMonth() + 1;

  const year = date.getFullYear();

  const day = date.getDate();


  useEffect(() => {
      changeDateFn(day, month, year);
  }, [date, selectedTeam]);

  return (
<div className={styles.calendarControllerBox}>
  Day
<div className={styles.calendarController}>
      <Fade cascade triggerOnce duration={300} direction="up">
      <input
              type="date"
              value={moment(date).format("YYYY-MM-DD")}
              onChange={(e) => setDate(new Date(e.target.value))}
              className={styles.calendarInput}
            />
        
      </Fade>
    </div>
</div>
  );
};


export default DayDatePicker;
