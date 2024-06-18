import React from "react";
import styles from "./Table.module.scss"
import NoData from "../NoData/NoData"

export default function Table({data}) {

    return (
        <div className={styles.table__wrapper}>
            {data.length === 0 ? window.innerWidth <= 600 ? <p className={styles.table__emptyText}>NO DATA AVAILABLE</p> : <div className={styles.table__emptyImg}><NoData /></div> : null}
        </div>
    )
}