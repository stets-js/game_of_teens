import React, { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import { useSelector } from "react-redux";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import styles from "./JuryPage.module.scss";


export default function JuryPage() {
  const userName = useSelector((state) => state.auth.user.name);
  return (
    <>
      <Header
        endpoints={[]}
        user={{ name: {userName} }}
      />
      <section className={styles.main_wrapper}>
        <BgWrapper title="Jury Page" />
        <p>JuryPage</p>
      </section>
    </>
  );
}
