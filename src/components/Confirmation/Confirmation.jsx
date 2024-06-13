import React from "react";
import { useSelector } from "react-redux";
import { getConfirmatorAppointments } from "../../redux/confirmator/confirmator-selectors";
import styles from "./Confirmation.module.scss";
import { Fade } from "react-awesome-reveal";

const Confirmator = () => {
  const appointments = useSelector(getConfirmatorAppointments);

  const transformAppointmentData = (i) => {
    const priorityManagers = [
      "MIC Overbooking Team 1", "MIC Overbooking Team 2", "MIC Overbooking Team 3",
      "MIC Overbooking Team 4", "MIC Overbooking Team 5", "MIC Overbooking Team 6", 
      "MIC Overbooking Team 7"
    ];

    const managerName = priorityManagers.includes(i.manager_name) 
      ? `<span class="${styles.highlight}">${i.manager_name}</span>`
      : i.manager_name;

    return `${i.hour}:00, ${i.course}, ${managerName}, ${i.phone},`;
  };

  return (
    <>
      {appointments.length === 0 ? (
        <h2 className={styles.errorTitle}>Nothing to confirm yet</h2>
      ) : (
        <ul className={styles.wrapper}>
          <Fade cascade duration={200}>
            {appointments.map((i) => {
              return (
                <li key={i.appointment_id} className={styles.ul_items}>
                  <p 
                    className={styles.ul_items_text} 
                    dangerouslySetInnerHTML={{ __html: transformAppointmentData(i) }}
                  />
                  <a className={styles.link} target="_blank" href={i.crm_link} rel="noreferrer">
                    Link
                  </a>
                </li>
              );
            })}
          </Fade>
        </ul>
      )}
    </>
  );
};

export default Confirmator;
