import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../SuperAdmin/SuperAdminPage.module.scss";
import path from "../../helpers/routerPath";
import Header from "../../components/Header/Header";
import CurrentMeetingsStatusDefinition from "../../components/CurrentMeetingsStatusDefinition/CurrentMeetingsStatusDefinition";
import DayDatePicker from "../../components/DayDatePicker/DayDatePicker";
import MeetingsTable from "../../components/MeetingsTable/MeetingsTable";
import SortByBox from "../../components/SortByBox/SortByBox";

import {
  getCurrentAppointments,
  getWeekId2,
} from "../../helpers/manager/manager";
import CrmLinks from "../../components/CrmLinks/CrmLinks";

import RadioButton from "../../components/RadioButton/RadioButton";
import { changeTypeSelection } from "../../redux/manager/manager-operations";
import { getTypeSelection } from "../../redux/manager/manager-selectors";
import {
  changeStatusSlot,
  setManagerError,
  setManagerLoading
} from "../../redux/manager/manager-operations";
import { updateSlot } from "../../helpers/week/week";

function CurrentMeetingsPageTable() {
  const [currentSelectedSortStatus, setcurrentSelectedSortStatus] =
    useState(false);
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);
  const isThatPhone = {
    isPhone: window.innerWidth <= 1160,
  };
  
  const tableDate = new Date().toString();

  const [currentTableData, setCurrentTableData] = useState(null);
  const [isRenderTableAvailable, setIsRenderTableAvailable] = useState(false);
  const [cureentTableDataWeekId, setCureentTableDataWeekId] = useState(0);
  const [date, setDate] = useState("");

  async function getTableData(day, month, year) {
    const resManagers = await getCurrentAppointments(`${day}.${month}.${year}`).then(
      (res) => res.data
    );
    setDate(`${day}.${month}.${year}`);
    const resWeekId = await getWeekId2(day, month, year).then((res) => res);
    setCurrentTableData(resManagers);
    setCureentTableDataWeekId(resWeekId);
    setIsRenderTableAvailable(true);
  }
  async function getNewTableData(day, month, year) {
    const resManagers = await getCurrentAppointments(`${day}.${month}.${year}`).then(
      (res) => res.data
    );
    setCurrentTableData(resManagers);
    setIsRenderTableAvailable(true);
  }

  const dispatch = useDispatch();
  const buttonType = useSelector(getTypeSelection);
  const onCheckedButton = (event) => {
    dispatch(changeTypeSelection(event.target.name));
  };


  return (
    <>
      <Header
        endpoints={[
          { text: "List View", path: path.currentManagersList },
          { text: "Table View", path: path.currentManagersTable },
        ]}
      />
      <CurrentMeetingsStatusDefinition /> {/* statusDefinition */}
      <div className={styles.wrapperControlButtons}>
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonGreenFocus}
          styleColor={styles.controlButtonGreen}
          onChangeType={onCheckedButton}
          title="Consultations"
        />
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonGrayFocus}
          styleColor={styles.controlButtonGray}
          onChangeType={onCheckedButton}
          title="Free"
        />
      </div>
      <DayDatePicker tableDate={tableDate} changeDateFn={getTableData} />
      <SortByBox
        sortText={"Selected"}
        sortTextFunc={setcurrentSelectedSortStatus}
      />
      {!isThatPhone.isPhone ? (
        isRenderTableAvailable ? (
          <>
          <MeetingsTable
            isTableView={true}
            isListView={false}
            weekId={cureentTableDataWeekId.id}
            dayIndex={cureentTableDataWeekId.day_index}
            table={currentTableData}
            selectedManagerIds={selectedManagerIds}
            setSelectedManagerIds={setSelectedManagerIds}
            currentSelectedSortStatus={currentSelectedSortStatus}
            date={date}
            getNewTableData={getNewTableData}
          />
          <div className={styles.main_wrapper}>
            <div className={styles.main_wrapper2}>
              <CrmLinks />
            </div>
          </div>
          </>
        ) : (
          <div className={styles.blank}>loading</div>
        )
      ) : (
        <div className={styles.blank}>this table is for PC use only</div>
      )}
    </>
  );
}

export default CurrentMeetingsPageTable;
