import React, {useEffect} from 'react';
import {Routes, Route, useNavigate, Navigate} from 'react-router-dom';
import {ConfirmProvider} from 'material-ui-confirm';

import './styles/App.scss';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import path from './helpers/routerPath';

import SuperAdministrator from './pages/SuperAdmin/SuperadminPage';
import JuryPage from './pages/Jury/JuryPage';
import HomePage from './pages/HomePage/HomePage';
import Footer from './components/Footer/Footer';
import {useSelector} from 'react-redux';
import PlayerPage from './pages/Player/PlayerPage';
import CoursesPage from './pages/Player/CoursesPage';
import CourseDetailPage from './pages/Player/CourseDetailPage';
import BlockPage from './pages/Player/BlockPage';
import AddNewBlock from './pages/Jury/AddNewBlock';
import EditBlock from './pages/Jury/EditBlock';
import MentorPage from './pages/Mentor/MentorPage';
import ProfilePage from './pages/Player/ProfilePage';
import Marathons from './pages/SuperAdmin/Marathons';
import JuriesPage from './pages/SuperAdmin/JuriesPage';
import CriteriasPage from './pages/SuperAdmin/CriteriasPage';

const App = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.user.role);
  const userId = useSelector(state => state.auth.user.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 1) {
        // navigate(path.superAdmin);
      } else if (userRole === 0) {
        navigate(`jury/${userId}/`);
      } else {
        // navigate(`player/${userId}/`);
      }
    } else {
      navigate(path.home);
    }
  }, [isAuthenticated, userRole, userId, navigate]);

  return (
    <>
      <ConfirmProvider>
        <Routes>
          {isAuthenticated && userRole === 1 && (
            <>
              <Route path={path.home} element={<Navigate to={`${path.superAdmin}`} />}></Route>
              <Route path={path.superAdmin} element={<SuperAdministrator />} />
              <Route path={path.superAdmin + path.marathons} element={<Marathons />} />
              <Route path={path.superAdmin + path.juries} element={<JuriesPage />} />
              <Route path={path.superAdmin + path.criterias} element={<CriteriasPage />} />
            </>
          )}
          {isAuthenticated && userRole === 0 && (
            <Route path={`jury/${userId}/`} element={<JuryPage />} />
          )}
          {isAuthenticated && userRole === 2 && (
            <>
              <Route
                path={`player/${userId}/courses/:courseId/sprint/:sprintId`}
                element={<BlockPage />}
              />
              <Route path={`player/${userId}/courses/:courseId`} element={<CourseDetailPage />} />
              <Route path={`player/${userId}/courses`} element={<CoursesPage />} />
              <Route path={`player/${userId}`} element={<PlayerPage />} />
              <Route path={path.userProfile} element={<ProfilePage />} />
              <Route path={path.all} element={<Navigate to={`player/${userId}`} />} />
            </>
          )}
          {isAuthenticated && userRole === 3 && (
            <>
              <Route
                path={`mentor/${userId}/courses/:courseId/sprint/:sprintId`}
                element={<BlockPage />}
              />
              <Route
                path={`mentor/${userId}/courses/:courseId/block`}
                element={<AddNewBlock />}></Route>
              <Route
                path={`mentor/${userId}/courses/:courseId/edit_block`}
                element={<EditBlock />}></Route>

              <Route path={`mentor/${userId}/courses/:courseId`} element={<CourseDetailPage />} />
              <Route path={`mentor/${userId}/courses`} element={<CoursesPage />} />
              <Route path={`mentor/${userId}`} element={<MentorPage />} />
              <Route path={path.all} element={<Navigate to={`mentor/${userId}`} />} />
            </>
          )}
          {!isAuthenticated && (
            <>
              <Route path={path.home} element={<HomePage />} />
              <Route path={path.all} element={<Navigate to={path.home} />} />
            </>
          )}
        </Routes>
        <Footer />
      </ConfirmProvider>
    </>
  );
};

export default App;
