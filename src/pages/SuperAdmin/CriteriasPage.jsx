import React from 'react';

import AdminStyles from './SuperAdminPage.module.scss';
import SuperAdminHeader from './SuperAdminHeader';
import JuryList from '../../components/users/JuryList';
import CriteriasList from '../../components/criterias/CriteriasList';

const CriteriasPage = () => {
  return (
    <>
      <SuperAdminHeader></SuperAdminHeader>
      <section className={AdminStyles.marathons__wrapper}>
        <CriteriasList />
      </section>
    </>
  );
};

export default CriteriasPage;
