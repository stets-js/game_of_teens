import React from 'react';

import AdminStyles from './SuperAdminPage.module.scss';
import SuperAdminHeader from './SuperAdminHeader';
import JuryList from '../../components/users/JuryList';

const JuriesPage = () => {
  return (
    <>
      <SuperAdminHeader></SuperAdminHeader>
      <section className={AdminStyles.marathons__wrapper}>
        <JuryList></JuryList>
      </section>
    </>
  );
};

export default JuriesPage;
