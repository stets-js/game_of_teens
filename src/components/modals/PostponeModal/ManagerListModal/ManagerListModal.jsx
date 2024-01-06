import React from "react";
import Button from "../../../Buttons/Buttons";
import Modal from "../../../Modal/Modal";
import styles from "../../../../pages/Caller/CallerPage.module.scss";
import { setPostponedConfirmation } from "../../../../helpers/confirmation/confirmation";
import { putAppointment } from "../../../../helpers/appointment/appointment";
import { info, success, error } from "@pnotify/core";

export default function ManagerListModal({
  closePostponed,
  isOpenDropdown,
  setIsOpenDropdown,
  appointmentId,
  isAppointment,
  weekId,
  link,
  courseId,
  phone,
  age,
  slotId,
  message,
}) {
  function formatDate(dateString) {
    var dateParts = dateString.split("-");
    var year = dateParts[0];
    var month = dateParts[1];
    var day = dateParts[2];

    var formattedDate = day + "." + month + "." + year;
    return formattedDate;
  }

  return (
    <>
      {isOpenDropdown && (
        <Modal onClose={() => setIsOpenDropdown(false)} index={10002}>
          <div className={styles.buttonsWrapper}>
            <p className={styles.availableManager}>Select available manager</p>
            <div className={styles.selectManagerList}>
              {isOpenDropdown.map((item) => {
                return <Button
                  onclick={(e) => {
                    if (isAppointment) {
                      const data = new FormData();
                      data.append("crm_link", link);
                      data.append("appointment_id", appointmentId);
                      data.append("day", item.week_day);
                      data.append("hour", item.time); //
                      data.append("course_id", courseId);
                      data.append("phone", phone);
                      data.append("age", age);
                      data.append("date", formatDate(item.date));
                      data.append("manager_id", item.manager_id);
                      data.append("message", message);
                      data.append("follow_up", item.follow_up);
                      data.append("postpone_role", window.location.pathname.split('/')[1]);
                      data.append("userId", window.location.pathname.split('/')[2]);
                      return putAppointment(data).then(() => {
                        setIsOpenDropdown("");
                        closePostponed();
                        success("Successfully postponed");
                      });
                    }
                    return setPostponedConfirmation(item.id, appointmentId)
                      .then(() => {
                        setIsOpenDropdown("");
                        closePostponed();
                        info("Successfully postponed");
                      })
                      .catch(({ message }) => error(message));
                  }}
                  key={item.id}
                  paddingRight={31}
                  paddingLeft={31}
                  width={"fit-content"}
                  bgColor={"black"}
                  color={"white"}
                  margin={"15px auto"}
                >
                  {item.name}
                </Button>
})}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
