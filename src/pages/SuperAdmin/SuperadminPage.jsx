import React from "react";
import styles from "./SuperAdminPage.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import { Outlet } from "react-router-dom";

const SuperAdministrator = () => {
  return (
    <>
      <Header
        endpoints={[]}
      />
      <section className={styles.main_wrapper}>
        <BgWrapper title="Super administrator" />
        <Outlet />
      </section>
    </>
  );
};

export default SuperAdministrator;
