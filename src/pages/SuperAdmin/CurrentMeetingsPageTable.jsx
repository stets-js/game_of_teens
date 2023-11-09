import React from "react";
import { useState, useEffect } from "react";
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

function CurrentMeetingsPageTable() {
  const [currentSelectedSortStatus, setcurrentSelectedSortStatus] =
    useState(false);
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);
  const isThatPhone = {
    isPhone: window.innerWidth <= 1160,
  };
  const styles = {
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "50px",
    marginBottom: "300px",
    fontSize: "30px",
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
    //console.log(`doing for ${day} to ${month} and ${year}`);
    setCurrentTableData(resManagers);
    setCureentTableDataWeekId(resWeekId);
    //console.log(`resWeekId has been changed`);
    setIsRenderTableAvailable(true);
  }
  //console.log(`resWeekId is ${JSON.stringify(cureentTableDataWeekId)}`);
  return (
    <>
      <Header
        endpoints={[
          { text: "List View", path: path.currentManagersList },
          { text: "Table View", path: path.currentManagersTable },
        ]}
      />
      <CurrentMeetingsStatusDefinition /> {/* statusDefinition */}
      <DayDatePicker tableDate={tableDate} changeDateFn={getTableData} />
      <SortByBox
        sortText={"Selected"}
        sortTextFunc={setcurrentSelectedSortStatus}
      />
      {!isThatPhone.isPhone ? (
        isRenderTableAvailable ? (
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
          />
        ) : (
          <div style={styles}>loading</div>
        )
      ) : (
        <div style={styles}>this table is for PC use only</div>
      )}
    </>
  );
}

export default CurrentMeetingsPageTable;
