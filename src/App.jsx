import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./styles/App.scss";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import path from "./helpers/routerPath";

import SuperAdministrator from "./pages/SuperAdmin/SuperadminPage";
import JuryPage from "./pages/Jury/JuryPage";
import HomePage from "./pages/HomePage/HomePage";
import Footer from "./components/Footer/Footer";
import { useSelector } from "react-redux";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.user.role);
  const userId = useSelector((state) => state.auth.user.id);
  return (
    <>
      <Routes>
        
      {isAuthenticated ? (
          <>
            {userRole === 3 && <Route path={path.all} element={<Navigate to={`${path.superAdmin}`} />} />}
            <Route path={path.superAdmin} element={<SuperAdministrator />} />
            {userRole === 2 && <Route path={path.all} element={<Navigate to={`jury/${userId}/`} />} />}
            <Route path={path.jury} element={<JuryPage />} />
          </>
        ) : (
          <>
          <Route path={path.all} element={<Navigate to={path.home} />} />
          <Route path={path.home} element={<HomePage />} />
          </>
        )}
      </Routes>
      
      <Footer />
    </>
  );
};

export default App;
