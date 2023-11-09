import React, { useEffect, Fragment, useState } from "react";
import styles from "./MeetingsTable.module.scss";
import MeetingsTableItem from "../MeetingsTableItem/MeetingsTableItem";
import { useSelector } from "react-redux";
import { isManagerLoading } from "../../redux/manager/manager-selectors";
import { getCallerLoading } from "../../redux/caller/caller-selectors";
import { TailSpin } from "react-loader-spinner";
import TableMarkup from "../TableMarkup/TableMarkup";
import { v4 as uuidv4 } from "uuid";

const MeetingsTable = ({
  isListView,
  tableTime,
  table,
  weekId,
  dayIndex,
  isStatusSorted,
  isTableView,
  currentSelectedSortStatus,
  selectedManagerIds,
  setSelectedManagerIds,
  date,
}) => {
  const indefyTimedSlotText = (timeid) => {
    switch (timeid) {
      case 1:
        return "Avaliable";
      case 2:
        return "Working time";
      case 6:
        return "Going on now";
      case 3:
        return "Scheduled";
      case 4:
        return "Confirmed";
      case 7:
        return "Successfully completed";
      case 8:
        return "Conducted unsuccessfully";
      default:
        return "Free";
    }
  };
  // console.log(date);
  let isTableLengthD = false;
  let isMarkUpAdded = false;

  useEffect(() => {});
  const managerLoading = useSelector(isManagerLoading);
  const callerLoading = useSelector(getCallerLoading);
  table = table.sort((a, b) => a.manager_name.localeCompare(b.manager_name));

  if (isStatusSorted) {
    table = table.filter((item) => {
      return (
        item.manager_appointments[tableTime - 8].status ||
        item.manager_appointments[tableTime - 8].status_id > 0
      );
    });
  }
  if (table.length === 0) {
    isTableLengthD = true;
    return (
      <MeetingsTableItem key={uuidv4()} text={"no data has been founded"} />
    );
  }

  return (
    <div key={uuidv4()} className={styles.wrapperTable}>
      {(managerLoading || callerLoading) && (
        <div key={uuidv4()} className={styles.spinner}>
          <TailSpin key={uuidv4()} height="57" width="57" color="#999DFF" />
        </div>
      )}
      <ul
        key={uuidv4()}
        className={!isListView ? styles.table : styles.table_list}
      >
        {table.map((item) => {
          let tiemedSlot = undefined;

          if (isListView) {
            tiemedSlot = item.manager_appointments.find((appointment) => {
              return appointment.time === tableTime;
            });
          }
          let timedSlotText;
          if (isListView) {
            timedSlotText = indefyTimedSlotText(
              tiemedSlot.status ? tiemedSlot.status : tiemedSlot.status_id
            );
          }
          // console.log(tiemedSlot);

          return (
            <>
              {isTableView && !isMarkUpAdded && (
                <>
                  {(isMarkUpAdded = true)}
                  <TableMarkup key={uuidv4()} />
                </>
              )}

              {currentSelectedSortStatus &&
              selectedManagerIds.includes(item.manager_id) === false ? (
                <></>
              ) : (
                <ul key={uuidv4()} className={styles.managerUl}>
                  <MeetingsTableItem
                    key={uuidv4()}
                    selectedManagerIds={selectedManagerIds}
                    setSelectedManagerIds={setSelectedManagerIds}
                    currentSelectedSortStatus={currentSelectedSortStatus}
                    isManagerSelectedFr={selectedManagerIds.includes(
                      item.manager_id
                    )}
                    text={item.manager_name}
                    managerId={item.manager_id}
                    managerName={true}
                    date={date}
                  />

                  {isTableLengthD ? (
                    <MeetingsTableItem key={uuidv4()} text={"no data"} />
                  ) : isListView && !isTableLengthD ? (
                    <>
                    {console.log("tiemedSlot -->", tiemedSlot)}
                    <MeetingsTableItem
                      key={uuidv4()}
                      managerId={item.manager_id}
                      selectedManagerIds={selectedManagerIds}
                      setSelectedManagerIds={setSelectedManagerIds}
                      currentSelectedSortStatus={currentSelectedSortStatus}
                      text={timedSlotText}
                      isManagerSelectedFr={selectedManagerIds.includes(
                        item.manager_id
                      )}
                      weekId={weekId}
                      dayIndex={dayIndex}
                      date={date}
                      hourIndex={tiemedSlot.time}
                      colorId={tiemedSlot.status_id || tiemedSlot.status}
                      //slotId={tiemedSlot.appointment_id}
                    /></>
                  ) : (
                    item.manager_appointments.map((item) => (
                      <>
                      {console.log("item", item)}
                      <MeetingsTableItem
                        key={uuidv4()}
                        managerId={item.manager_id}
                        selectedManagerIds={selectedManagerIds}
                        setSelectedManagerIds={setSelectedManagerIds}
                        isManagerSelectedFr={selectedManagerIds.includes(
                          item.manager_id
                        )}
                        currentSelectedSortStatus={currentSelectedSortStatus}
                        text={item.text}
                        weekId={weekId}
                        slotId={item.slot_id}
                        dayIndex={dayIndex}
                        date={date}
                        hourIndex={item.time}
                        colorId={item.status_id || item.status}
                      />
                      </>
                    ))
                  )}
                </ul>
              )}
            </>
          );
        })}
      </ul>
    </div>
  );
};

export default MeetingsTable;
