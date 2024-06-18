import React from "react";
import { useSelector } from "react-redux";
import styles from "./Table.module.scss";
import NoData from "../NoData/NoData";
import { TailSpin } from "react-loader-spinner";

export default function Table({ data }) {
    const userId = useSelector((state) => state.auth.user.id);
    const loading = useSelector((state) => state.load.loading);

    const handleEdit = (id) => {
        // Функціонал редагування буде реалізовано пізніше
        console.log(`Редагувати елемент з id: ${id}`);
    };

    return (
        <div className={styles.table__wrapper}>
            {loading ? (
                <div className={styles.spinner}>
                    <TailSpin height="130px" width="130px" color="#999DFF" />
                </div>
            ) : (
                <>
                    {data.length === 0 ? (
                        window.innerWidth <= 600 ? (
                            <p className={styles.table__emptyText}>NO DATA AVAILABLE</p>
                        ) : (
                            <div className={styles.table__emptyImg}><NoData /></div>
                        )
                    ) : (
                        <div className={styles.table}>
                            <div className={styles.thead}>
                                <div className={styles.tr}>
                                    <div className={styles.th}>Ім'я</div>
                                    <div className={styles.th}>Лінк на репозиторій</div>
                                    <div className={styles.th}>Лінк на відео</div>
                                    {data[0].criterias.map((criteria) => (
                                        <div key={criteria._id} className={styles.th}>{criteria.name}</div>
                                    ))}
                                    <div className={styles.th}>Редагувати</div>
                                </div>
                            </div>
                            <div className={styles.tbody}>
                                {data.map((item) => {
                                    const userJure = item.jures.find((jure) => jure.jureId === userId);
                                    return (
                                        <div key={item._id} className={styles.tr}>
                                            <div className={styles.td}>{item.name}</div>
                                            <div className={styles.td}>
                                                <a href={item.project_link} target="_blank" rel="noopener noreferrer">
                                                    Репозиторій
                                                </a>
                                            </div>
                                            <div className={styles.td}>
                                                <a href={item.video_link} target="_blank" rel="noopener noreferrer">
                                                    Відео
                                                </a>
                                            </div>
                                            {item.criterias.map((criteria) => {
                                                const score = userJure
                                                    ? userJure.scores.find((score) => score.criteria === criteria._id)?.score
                                                    : 'N/A';
                                                return <div key={criteria._id} className={styles.td}>{score}</div>;
                                            })}
                                            <div className={styles.td}>
                                                <button onClick={() => handleEdit(item._id)}>Редагувати</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
