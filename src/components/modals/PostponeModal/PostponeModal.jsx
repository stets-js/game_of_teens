import "react-calendar/dist/Calendar.css";
import React, { useEffect, useState } from "react";
import styles from "../../../pages/Caller/CallerPage.module.scss";
import BgWrapper from "../../BgWrapper/BgWrapper";
import { Outlet } from "react-router-dom";
import DatePicker from "../../DatePicker/DatePicker";
import { useSelector, useDispatch } from "react-redux";
import Table from "../../Table/Table";
import Days from "../../Days/Days";
import { getUsersByRole } from "../../../helpers/user/user";

import {
  getCallerDate,
  getTable,
  getWeekId,
} from "../../../redux/caller/caller-selectors";
import {
  getCallerCurrentWeek,
  getCallerWeek,
} from "../../../redux/caller/caller-operations";
import Button from "../../Buttons/Buttons";
// import ManagerListModal from "./ManagerListModal/ManagerListModal";
import { Fade } from "react-awesome-reveal";
import ChangeAppointentManager from "../ChangeAppointentManager/ChangeAppointentManager";
import { createPortal } from "react-dom";
import { getWeekIdByTableDate } from "../../../helpers/week/week";
const modalRef = document.querySelector("#postpone-modal");


export default function PostponeModal({
  isOpen,
  onClose,
  appointmentId,
  date,
  isAppointment,
  link,
  courseId,
  slotId,
  phone,
  age,
  message,
  weekId,
  day,
  hour,
  isFollowUp
}) {
  const [callerId, setCallerId] = useState(null);
  const [error, setError] = useState("");
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isChangeManagerOpened, setIsChangeManagerOpened] = useState(false);
  const [currentDay, setCurrentDay] = useState(day);
  const [currentHour, setCurrentHour] = useState(hour);
  const [currentWeekId, setCurrentWeekId] = useState(weekId);
  const dispatch = useDispatch();
  const tableDate = useSelector(getCallerDate);
  const wid = useSelector(getWeekId);
  const table = useSelector(getTable);
  

  const onClickSlotFn = (weekIdNew, dayIndexNew, hourIndexNew) => {
    setCurrentDay(dayIndexNew);
    setCurrentHour(hourIndexNew);
    setIsChangeManagerOpened(!isChangeManagerOpened);
  };

  useEffect(() => {
    dispatch(getCallerCurrentWeek(callerId));
    getUsersByRole("Confirmator")
      .then(({ data }) => {
        setCallerId(data[0].id);
      })
      .catch(() => setError("Caller not found"));
  }, [dispatch]);

  useEffect(() => {
    getWeekIdByTableDate(tableDate).then((data) => {
      setCurrentWeekId(data.id+1);
    });
  }, [tableDate]);

  useEffect(() => {
      setCurrentWeekId(wid+1);
  }, []);

  return createPortal(
    isOpen ? (
      <div className={styles.postponedWrapper}>
        {/* <ManagerListModal
          closePostponed={onClose}
          appointmentId={appointmentId}
          isOpenDropdown={isOpenDropdown}
          setIsOpenDropdown={setIsOpenDropdown}
          isAppointment={isAppointment}
          weekId={weekId}
          link={link}
          courseId={courseId}
          phone={phone}
          age={age}
          slotId={slotId}
          message={message}
        /> */}

        {isChangeManagerOpened && (
          <ChangeAppointentManager
            isOpen={isChangeManagerOpened}
            handleClose={setIsChangeManagerOpened}
            courseId={courseId}
            day={currentDay}
            weekId={currentWeekId}
            hour={currentHour}
            age={age}
            phone={phone}
            link={link}
            appointmentId={appointmentId}
            message={""}
            isPostponed={true}
            closePostpone={onClose}
            isFollowUp={isFollowUp}
          />
        )}

        <Fade duration={200}>
          <BgWrapper top={-120} title="Postpone the meeting" />
          <Outlet />
          <p className={styles.free__places}>
            <span className={styles.free__span}>--</span> - number of free
            places
          </p>
          <section className={styles.tableSection}>
            <DatePicker
              changeDateFn={getCallerWeek}
              tableDate={tableDate}
              caller={true}
            />
            <Days />
            {!error && (
              <Table
                postponed
                isAppointment={isAppointment}
                onClickSlotFn={onClickSlotFn}
                weekId={currentWeekId}
                table={table}
                caller={true}
                onPostpone={true}
              />
            )}
            {error && <p className={styles.free__places}>{error.message}</p>}
          </section>
          <div className={styles.button}>
            <Button
              onclick={onClose}
              paddingRight={31}
              paddingLeft={31}
              width={"auto"}
              bgColor={"black"}
              color={"white"}
            >
              Return to confirmations
            </Button>
          </div>
        </Fade>
      </div>
    ) : (
      <></>
    ),
    modalRef
  );
}
