import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./CallerPage.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import { Outlet, useParams } from "react-router-dom";
import DatePicker from "../../components/DatePicker/DatePicker";
import { useSelector, useDispatch } from "react-redux";
import "react-calendar/dist/Calendar.css";
import Table from "../../components/Table/Table";
import DayTable from "../../components/DayTable/DayTable";
import Days from "../../components/Days/Days";
import DaysPicker from "../../components/DaysPicker/DaysPicker";
import { getUserById } from "../../helpers/user/user";
import {
  getCallerDate,
  getTable,
  getWeekId,
} from "../../redux/caller/caller-selectors";
import { getCallerCurrentWeek, getCallerWeek } from "../../redux/caller/caller-operations";

import { isManagerLoading } from "../../redux/manager/manager-selectors";
import { getCallerLoading } from "../../redux/caller/caller-selectors";

export default function CallerPage() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const tableDate = useSelector(getCallerDate);
  const table = useSelector(getTable);
  const weekId = useSelector(getWeekId);
  const { callerId } = useParams();
  const [callerName, setCallerName] = useState("");
  console.log("tableDate",tableDate)

  const managerLoading = useSelector(isManagerLoading);
  const callerLoading = useSelector(getCallerLoading);

  useEffect(() => {
    dispatch(getCallerCurrentWeek(+callerId));
    getUserById(+callerId)
      .then((data) => {
        setCallerName(data.data.name);
      })
      .catch((err) => {
        setError(err);
      });
  }, [dispatch, callerId]);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  //console.log(`currentDayIndex in the call-center pager is ${currentDayIndex}`);
  function setDayIndex(num) {
    setCurrentDayIndex(num);
  }

  return (
    <>
      <Header user={{ name: callerName, role: "Caller" }} />
      <div className={styles.main__wrapper}>
        <BgWrapper top={-160} title="Caller" />
        <Outlet />
        <p className={styles.free__places}>
          <span className={styles.free__span}>--</span> - number of free places
        </p>
        <section className={styles.tableSection}>
          {managerLoading || callerLoading ? <div className={styles.loadingBackdrop}></div> : null}
          <DatePicker changeDateFn={getCallerWeek} tableDate={tableDate} caller />
         {window.innerWidth > 1160 ? (
        <Days caller />
      ) : (
        <DaysPicker caller setDayIndex={setDayIndex} />
      )}
       {window.innerWidth > 1160 ? (
        <Table table={table} weekId={weekId}  caller/>
      ) : (
        <DayTable
          weekId={weekId} 
          table={table[currentDayIndex]}
          dayIndex={currentDayIndex}
          caller
        />
      )}
          {error && <p className={styles.free__places}>{error.message}</p>}
        </section>
      </div>
    </>
  );
}
