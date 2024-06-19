import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Table.module.scss";
import NoData from "../NoData/NoData";
import { TailSpin } from "react-loader-spinner";
import Modal from "../Modal/Modal";
import EditForm from "../EditForm/EditForm";

export default function Table({ data }) {
    const userId = useSelector((state) => state.auth.user.id);
    const loading = useSelector((state) => state.load.loading);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const handleEdit = (item) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    return (
        <>
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <EditForm item={currentItem} onClose={closeModal} />
                </Modal>
            )}

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
                                        <div className={styles.th}>Оцінити</div>
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
                                                    <button onClick={() => handleEdit(item)} className={styles.btn__edit}>Оцінити</button>
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
        </>
    );
}
