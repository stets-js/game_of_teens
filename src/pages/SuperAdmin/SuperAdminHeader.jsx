import React, {useState, useEffect} from 'react';
import Header from '../../components/Header/Header';
import {useSelector, useDispatch} from 'react-redux';
import path from '../../helpers/routerPath';

const SuperAdminHeader = () => {
  const userName = useSelector(state => state.auth.user);
  return (
    <>
      <Header
        endpoints={[
          {text: 'Tables', path: path.superAdmin},
          {text: 'Marathons', path: path.superAdmin + path.marathons},
          {text: 'Juries', path: path.superAdmin + path.juries},
          {text: 'Criterias', path: path.superAdmin + path.criterias}
        ]}
        user={userName}
      />
    </>
  );
};

export default SuperAdminHeader;
