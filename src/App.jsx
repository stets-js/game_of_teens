import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./styles/App.scss";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import path from "./helpers/routerPath";

import ModalsPage from "./pages/ModalsPage/ModalsPage";

import AdminPage from "./pages/Admin/AdminPage";
import AdminUsersPage from "./pages/Admin/UsersPage";
import AdminGroupsPage from "./pages/Admin/GroupsPage";
import AdminCoursesPage from "./pages/Admin/CoursesPage";
import AdminActionsPage from "./pages/Admin/ActionsPage";

import SuperAdministratorPage from "./pages/SuperAdmin/SuperadminPage";
import UsersPage from "./pages/SuperAdmin/UsersPage";
import GroupsPage from "./pages/SuperAdmin/GroupsPage";
import CoursesPage from "./pages/SuperAdmin/CoursesPage";
import ActionsPage from "./pages/SuperAdmin/ActionsPage";
import CrmPage from "./pages/SuperAdmin/CrmPage";
import CurrentMeetingsPage from "./pages/SuperAdmin/CurrentMeetingsPage";
import CurrentMeetingsPageList from "./pages/SuperAdmin/CurrentMeetingsPageList";
import CurrentMeetingsPageTable from "./pages/SuperAdmin/CurrentMeetingsPageTable";
import History from "./pages/SuperAdmin/History";
import AuthLogs from "./pages/SuperAdmin/AuthLogs";
import ConsultationLogs from "./pages/SuperAdmin/ConsultationLogs";
import SlotHistory from "./pages/SuperAdmin/SlotHistory";

import ManagerPage from "./pages/Manager/ManagerPage";
import ConsultationsPage from "./pages/Manager/ConsultationsPage";
import PlanningPage from "./pages/Manager/PlanningPage";

import CallerPage from "./pages/Caller/CallerPage";
import ConfirmatorPage from "./pages/Confirmator/ConfirmatorPage";
import ConfirmedPage from "./pages/Confirmator/ConfirmedPage";

import AvaliablePage from "./pages/Confirmator/AvaliablePage";

import HomePage from "./pages/HomePage/HomePage";

import Statistics from "./pages/Statistics/Statistics";

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
            <Route path={path.modals} element={<ModalsPage />} />
              <Route path={path.history} element={<History />} >
                <Route path={path.authorization} element={<AuthLogs />} />
                <Route path={path.ik} element={<ConsultationLogs />} />
                <Route path={path.slotHistory} element={<SlotHistory />} />
              </Route>
            <Route path={path.currentManagers} element={<CurrentMeetingsPage />} />
            <Route path={path.currentManagersList} element={<CurrentMeetingsPageList />} />
            <Route path={path.currentManagersTable} element={<CurrentMeetingsPageTable />} />
            <Route path={path.admin} element={<Navigate to={path.users} />} />
            <Route path={path.admin} element={<AdminPage />}>
              <Route path={path.users} element={<AdminUsersPage />} />
              <Route path={path.groups} element={<AdminGroupsPage />} />
              <Route path={path.courses} element={<AdminCoursesPage />} />
              <Route path={path.actions} element={<AdminActionsPage />} />
              <Route path={path.crm} element={<CrmPage />} />
            </Route>



            {userRole === 3 && <Route path={path.home} element={<Navigate to={`${path.superAdmin}`} />} />}
            <Route path={path.superAdmin} element={<Navigate to={path.users} />} />
            <Route path={path.superAdmin} element={<SuperAdministratorPage />}>
              <Route path={path.users} element={<UsersPage />} />
              <Route path={path.groups} element={<GroupsPage />} />
              <Route path={path.courses} element={<CoursesPage />} />
              <Route path={path.actions} element={<ActionsPage />} />
              <Route path={path.crm} element={<CrmPage />} />
            </Route>

            {(userRole === 2 || userRole === 3) && (
              <>
            {userRole === 2 && <Route path={path.home} element={<Navigate to={`manager/${userId}/consultations/`} />} />}
              <Route path={path.confirmator} element={<ConfirmatorPage />} />
              <Route path={path.confirmed} element={<ConfirmedPage />} />
            {/* <Route path={path.manager} element={<Navigate to={path.planning} />} /> */}
            <Route path={path.manager} element={<ManagerPage />}>
              <Route path={path.consultations} element={<ConsultationsPage />} />
              <Route path={path.planning} element={<PlanningPage />} />
              <Route path={path.crm} element={<CrmPage />} />
            </Route>
            </>
            )}

            {(userRole === 5 || userRole === 3) && (
              <>
                {userRole === 5 && <Route path={path.home} element={<Navigate to={`confirmator/${userId}/`} />} />}
            <Route path={path.confirmator} element={<ConfirmatorPage />} />
            <Route path={path.confirmed} element={<ConfirmedPage />} />
            <Route path={path.pageCrm} element={<CrmPage page />} />
            <Route path={path.manager} element={<ManagerPage />}>
              <Route path={path.consultations} element={<ConsultationsPage />} />
              <Route path={path.planning} element={<PlanningPage />} />
              <Route path={path.crm} element={<CrmPage />} />
            </Route>
              </>
            )}

            {(userRole === 4 || userRole === 3) && (
              <>
            {userRole === 4 && <Route path={path.home} element={<Navigate to={`caller/${userId}/`} />} />}
            <Route path={path.caller} element={<CallerPage />} />
              
            <Route path={path.manager} element={<ManagerPage />}>
              <Route path={path.consultations} element={<ConsultationsPage />} />
              <Route path={path.planning} element={<PlanningPage />} />
              <Route path={path.crm} element={<CrmPage />} />
            </Route>
            <Route path={path.pageCrm} element={<CrmPage page />} />
            </>
            )}

            {/* <Route path={path.home} element={<HomePage />} /> */}
            <Route path={path.statistics} element={<Statistics />} />
            <Route path={path.avaliable} element={<AvaliablePage />} />
            
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
