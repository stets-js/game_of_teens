import React from "react";
import { useState } from "react";
import path from "../../helpers/routerPath";
import Header from "../../components/Header/Header";
import CurrentMeetingsStatusDefinition from "../../components/CurrentMeetingsStatusDefinition/CurrentMeetingsStatusDefinition";
import DayDatePicker from "../../components/DayDatePicker/DayDatePicker";
import DayTimePicker from "../../components/DayTimePicker/DayTimePicker";
import MeetingsTable from "../../components/MeetingsTable/MeetingsTable";
import SortByBox from "../../components/SortByBox/SortByBox";

import {
  getCurrentAppointments,
  getWeekId,
} from "../../helpers/manager/manager";

function CurrentMeetingsPageList() {
  const [currentSortStatus, setcurrentSortStatus] = useState(false);
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);
  const [currentSelectedSortStatus, setcurrentSelectedSortStatus] = useState(false);
  //console.log(`currentSelectedSortStatus is ${currentSelectedSortStatus}`);
  const styles = {
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "50px",
    marginBottom: "300px",
    fontSize: "30px",
  };
  const isThatPhone = {
    isPhone: window.innerWidth <= 1160,
  };
  const dividerStyles = {
    display: "flex",
    marginRight: "auto",
    marginLeft: "auto",
    maxWidth: "480px",
    width: "100%",
    justifyContent: "space-between",
  };
  const dividerStylesAdpt = {
    display: "flex",
    flexDirection: "column",
    marginRight: "auto",
    marginLeft: "auto",
    width: "100%",
    maxWidth: "480px",
    justifyContent: "space-between",
  };

  const tableDate = new Date().toString();
  const [tableTime, setTableTime] = useState(8);

  const [currentTableData, setCurrentTableData] = useState(null);
  const [isRenderTableAvailable, setIsRenderTableAvailable] = useState(false);
  const [cureentTableDataWeekId, setCureentTableDataWeekId] = useState(0);
  const [date, setDate] = useState("");

    async function getTableData(day, month, year) {
    const resManagers = await getCurrentAppointments(`${day}.${month}.${year}`).then(
      (res) => res.data
    );
    setDate(`${day}.${month}.${year}`);
    const resWeekId = await getWeekId(day, month, year).then((res) => res);
    setCurrentTableData(resManagers);
    setIsRenderTableAvailable(true);
    setCureentTableDataWeekId(resWeekId);
  }
  // console.log(`now time for sort is ${tableTime}`);
  // console.log(`now currentSortStatus is ${currentSortStatus}`);

  return (
    <>
      <Header
        endpoints={[
          { text: "List View", path: path.currentManagersList },
          { text: "Table View", path: path.currentManagersTable },
        ]}
      />
      <div style={isThatPhone.isPhone ? dividerStylesAdpt : dividerStyles}>
        {" "}
        <DayDatePicker tableDate={tableDate} changeDateFn={getTableData} />
        <DayTimePicker tableTime={tableTime} setTableTime={setTableTime} />
      </div>
      <SortByBox
        sortText={"Status"}
        sortTextFunc={setcurrentSortStatus}
        sortMan={"Selected"}
        sortMangFunc={setcurrentSelectedSortStatus}
      />
      {isRenderTableAvailable ? (
        <MeetingsTable
          isListView={true}
          isStatusSorted={currentSortStatus}
          tableTime={tableTime}
          weekId={cureentTableDataWeekId.id}
          dayIndex={cureentTableDataWeekId.day_index}
          selectedManagerIds={selectedManagerIds}
          setSelectedManagerIds={setSelectedManagerIds}
          currentSelectedSortStatus={currentSelectedSortStatus}
          table={currentTableData}
        />
      ) : (
        <div style={styles}>loading</div>
      )}
    </>
  );
}

export default CurrentMeetingsPageList;
