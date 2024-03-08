import React from "react";
import path from "../../helpers/routerPath";
import Header from "../../components/Header/Header";
import { Outlet } from "react-router-dom";

const History = () => {
  return (
    <>
      <Header
        endpoints={[
          {text:"Login history", path: path.authorization},
          {text:"Appointment history", path: path.ik},
          {text:"Slot history", path: path.slotHistory},
          {text:"Google sheets", path: path.googleSheets}
        ]}
      />
    
      <Outlet />
    </>
  );
};

export default History;
