import React from "react";
import styles from "./SuperAdminPage.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const SuperAdministrator = () => {
  const userName = useSelector((state) => state.auth.user.name);
  return (
    <>
      <Header
        endpoints={[]}
        user={{ name: {userName}}}
      />
      <section className={styles.main_wrapper}>
        <BgWrapper title="Super administrator" />
        <p>Super administrator</p>
      </section>
    </>
  );
};

export default SuperAdministrator;
