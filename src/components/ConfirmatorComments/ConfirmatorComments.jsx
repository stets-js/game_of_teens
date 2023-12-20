import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  setCancelConfirmation,
  setConfirmation,
} from "../../helpers/confirmation/confirmation";
import styles from "../../pages/Confirmator/ConfirmatorPage.module.scss";
import {
  getConfirmatorAppointments,
} from "../../redux/confirmator/confirmator-selectors";

const ConfirmatorComments = ({ value }) => {
  const appointments = useSelector(getConfirmatorAppointments);
  const [reject, setReject] = useState({});
  const [confirm, setConfirm] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);

  const confirmationTable = [
    {
      text: "time",
    },
    {
      text: "money",
    },
    {
      text: "other",
    },
  ];

  useEffect(() => {
    Object.keys(reject).forEach((item) =>
      setCancelConfirmation(reject[item].slot_id, 1, reject[item].text)
    );
  }, [reject]);

  const handleMouseEnter = (itemId) => {
    setHoveredItem(itemId);
  };
  
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      {appointments.map((item) => (
        <div key={item.appointment_id} className={styles.comment__wrapper}>
          {value[item.appointment_id] !== "confirmed" && value[item.appointment_id] !== "canceled" && (
          <div className={styles.commentsWrapper}><svg
          onMouseEnter={() => handleMouseEnter(item.appointment_id)}
          onMouseLeave={handleMouseLeave} 
          xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
          <path fill="#8bb7f0" d="M15,28.5C7.556,28.5,1.5,22.444,1.5,15S7.556,1.5,15,1.5S28.5,7.556,28.5,15S22.444,28.5,15,28.5z"></path><path fill="#4e7ab5" d="M15,2c7.168,0,13,5.832,13,13s-5.832,13-13,13S2,22.168,2,15S7.832,2,15,2 M15,1 C7.268,1,1,7.268,1,15s6.268,14,14,14s14-6.268,14-14S22.732,1,15,1L15,1z"></path><path fill="#fff" d="M15 7.75A1.25 1.25 0 1 0 15 10.25 1.25 1.25 0 1 0 15 7.75zM16 21L16 12 13 12 13 13 14 13 14 21 13 21 13 22 17 22 17 21z"></path>
          </svg>{hoveredItem === item.appointment_id && (
              <div className={styles.commentsWindow}>
              {item.comments}
              </div>
              )}</div>)}
              
          {value[item.appointment_id] === "confirmed" && (
            <input
              type="text"
              className={styles.comment__input}
              placeholder="Write a comment here..."
              onChange={({ target }) => setConfirm(target.value)}
              onBlur={() =>
                confirm && setConfirmation(item.slot_id, 4, confirm)
              }
            />
          )}
          {value[item.appointment_id] === "canceled" && (
            <div className={styles.comment__reject_btn}>
              {confirmationTable.map((i) => {
                return (
                  <button
                    key={i.text}
                    onClick={() => {
                      setReject({
                        ...reject,
                        [item.appointment_id]: {
                          slot_id: item.slot_id,
                          text: i.text,
                        },
                      });
                    }}
                    className={`${styles.btn} ${
                      reject[item.appointment_id]?.text === i.text &&
                      styles.btn_active
                    }`}
                  >
                    {i.text}
                  </button>
                );
              })}
              <input
                type="text"
                className={styles.comment__input}
                placeholder="Write a comment here..."
                value={reject[item.appointment_id]?.text}
                onChange={({ target }) =>
                  setReject({
                    ...reject,
                    [item.appointment_id]: {
                      slot_id: item.slot_id,
                      text: target.value,
                    },
                  })
                }
                onBlur={() =>
                  reject[item.appointment_id] &&
                  setCancelConfirmation(
                    item.slot_id,
                    1,
                    reject[item.appointment_id]
                  )
                }
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ConfirmatorComments;
