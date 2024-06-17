import React, { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";


export default function ManagerPage() {
  
  return (
    <>
      <Header
        endpoints={[]}
        user={{ name: "managerName", role: "Jury" }}
      />
      <Outlet  />
    </>
  );
}
