import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./MeetingsTableItem.module.scss";
import ConsultationInfo from "../modals/ConsultationInfo/ConsultationInfo";
import NewAppointment from "../modals/NewAppointment2/NewAppointment";

import {
  changeStatusSlot,
  setManagerError,
  setManagerLoading,
  getManagerCurrentWorkWeek,
  getManagerWorkWeek,
} from "../../redux/manager/manager-operations";
import { useSelector, useDispatch } from "react-redux";
import { postStartConsultation } from "../../helpers/consultation/consultation";
import { updateSlot } from "../../helpers/week/week";
import {
  getDate,
  getTable,
  getWeekId,
} from "../../redux/manager/manager-selectors";

const MeetingsTableItem = ({
  managerName,
  text,
  managerId,
  data,
  colorId,
  onClickFn,
  consultation,
  isManagerSelectedFr,
  weekId,
  dayIndex,
  hourIndex,
  slotId,
  onClickBtnStart,
  postponed,
  slots,
  currentSelectedSortStatus,
  date,
  selectedManagerIds,
  setSelectedManagerIds,
}) => {
  const [isManagerSelected, setisManagerSelected]=useState(isManagerSelectedFr)
  const table = useSelector(getTable);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState("");
  const activeClassnames = (colorId) => {
    return classNames(styles.item, {
      [styles.grayColor]: +colorId === 0,
      [styles.orangeColor]: +colorId === 2,
      [styles.greenColor]: +colorId === 1,
      [styles.blueColor]: +colorId === 3,
      [styles.purpleColor]: +colorId === 4,
      [styles.darkOrangeColor]: +colorId === 6,
      [styles.darkGreenColor]: +colorId === 7,
      [styles.redColor]: +colorId === 8,
    });
  };

  const activeCallerClassnames = (colorId) => {
    return classNames(styles.item, {
      [styles.callerYellowColor]: +colorId === 2,
      [styles.callerOrangeColor]: +colorId === 1,
      [styles.callerRedColor]: +colorId === 0,
      [styles.callerGreenColor]: +colorId >= 4,
      [styles.callerLightGreenColor]: +colorId === 3,
    });
  };
  const activeCallerFreeClassnames = (colorId) => {
    return classNames(styles.free__button, {
      [styles.callerFreeYellowColor]: +colorId === 2,
      [styles.callerFreeOrangeColor]: +colorId === 1,
      [styles.callerFreeRedColor]: +colorId === 0,
      [styles.callerFreeGreenColor]: +colorId >= 4,
      [styles.callerFreeLightGreenColor]: +colorId === 3,
    });
  };

  const dispatch = useDispatch();
  const onClickSlotButton = (dayIndex, hourIndex, managerFuncId) => {
    // console.log("Point1");
    dispatch(setManagerLoading(true));
    // console.log("Point2");
    return postStartConsultation(weekId, dayIndex, hourIndex, managerFuncId)
      .then(() => {
        return updateSlot(managerFuncId, weekId, dayIndex, hourIndex, 6)
          .then(() => {
            dispatch(
              changeStatusSlot({
                dayIndex,
                hourIndex,
                colorId: 6,
              })
            );
            //console.log("Point3");
          })
          .catch((error) => dispatch(setManagerError(error.message)));
      })
      .catch((error) => dispatch(setManagerError(error.message)))
      .finally(() => dispatch(setManagerLoading(false)));
  };

  function toggleSelectedManager(
    managerId,
    selectedManagerIds,
    setSelectedManagerIds
  ) {
    const isSelected = selectedManagerIds.includes(managerId);
    if (isSelected) {
      setSelectedManagerIds(
        selectedManagerIds.filter((id) => id !== managerId)
      );
    } else {
      setSelectedManagerIds([...selectedManagerIds, managerId]);
    }
  }

  function toggleSelectedManager2(arr, val, setSelectedManagerIds) {
    const index = arr.indexOf(val);
    if (index === -1) {
      // Value not found in array, add it
      arr.push(val);
      setisManagerSelected(true)
    } else {
      // Value found in array, remove it
      arr.splice(index, 1);
      setisManagerSelected(false)
    }
    setSelectedManagerIds(arr);
  }

  // console.log(`isManagerSelected is ${isManagerSelected}`);
  return (
    <>
      {managerName && text === "Managers" ? (
        <>
          <a
            className={classNames(
              activeClassnames(colorId),
              styles.managerNameStManager
            )}
            href={`#`}
          >
            {text !== undefined ? text : `manager name is undefined`}
          </a>
        </>
      ) : managerName ? (
        <>
          <label className={styles.itemCheckboxLabel}>
            <input
              type="checkbox"
              id={managerId}
              checked={isManagerSelected}
              className={styles.itemCheckbox}
              onChange={() => {
                toggleSelectedManager2(
                  selectedManagerIds,
                  managerId,
                  setSelectedManagerIds
                );
                // console.log(selectedManagerIds);
                // console.log(`isManagerSelected is ${isManagerSelected}`);
              }}
            />
            <span className={styles.itemCheckboxCheckmark}></span>
          </label>
          <a
            className={classNames(
              activeClassnames(colorId),
              styles.managerNameSt
            )}
            href={`/manager/${managerId}/planning`}
          >
            {text !== undefined ? text : `manager name is undefined`}
          </a>
        </>
      ) : colorId === 3 ? (
        <>
          <li
            onClick={onClickFn}
            key={dayIndex}
            className={activeClassnames(colorId)}
          >
            {text !== undefined ? text : ``}
            <div className={styles.hover_buttons}>
              <button
                type="button"
                className={styles.styled_button}
                onClick={() => {
                  setIsOpen(!isOpen);
                  setModal("appointment");
                }}
              >
                info
              </button>
            </div>
          </li>
          {modal === "appointment" && (
            <NewAppointment
              isOpen={isOpen}
              time={data}
              weekId={weekId}
              slotId={slotId}
              dayIndex={dayIndex}
              date={date}
              hourIndex={hourIndex}
              handleClose={() => setIsOpen(!isOpen)}
            />
          )}
        </>
      ) : colorId === 4 ? (
        <>
          <li
            onClick={onClickFn}
            key={dayIndex}
            className={activeClassnames(colorId)}
          >
            {text !== undefined ? text : ``}
            <div className={styles.hover_buttons}>
              <button
                type="button"
                onClick={() => {
                  onClickSlotButton(dayIndex, hourIndex, managerId);
                }}
              >
                start
              </button>
              <button
                type="button"
                className={styles.styled_button}
                onClick={() => {
                  setIsOpen(!isOpen);
                  setModal("consultation");
                }}
              >
                info
              </button>
            </div>
          </li>
          {modal === "consultation" && (
            <ConsultationInfo
              dayIndex={dayIndex}
              hourIndex={hourIndex}
              isOpen={isOpen}
              handleClose={() => setIsOpen(!isOpen)}
              slotId={+slotId}
            />
          )}
        </>
      ) : (
        <li onClick={onClickFn} className={activeClassnames(colorId)}>
          {text !== undefined ? text : ``}
        </li>
      )}
    </>
  );
};

MeetingsTableItem.propTypes = {
  colorId: PropTypes.number.isRequired,
  onClickFn: PropTypes.func,
  consultation: PropTypes.bool,
};
MeetingsTableItem.defaultProps = {
  colorId: 0,
};
export default MeetingsTableItem;
