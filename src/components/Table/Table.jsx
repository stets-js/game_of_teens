import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Table.module.scss";
import NoData from "../NoData/NoData";
import { TailSpin } from "react-loader-spinner";
import Modal from "../Modal/Modal";
import EditForm from "../EditForm/EditForm";

export default function Table({ data, onUpdate, admin }) {
  const userId = useSelector((state) => state.auth.user.id);
  const loading = useSelector((state) => state.load.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [sortedData, setSortedData] = useState([]);

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    onUpdate();  // Викликаємо onUpdate при закритті модалки
  };

  useEffect(() => {
    if (admin) {
      const sorted = [...data].sort((a, b) => b.totalSumOfAvgScores - a.totalSumOfAvgScores);
      setSortedData(sorted);
    } else {
      setSortedData(data);
    }
  }, [data, admin]);

  const renderAdminTable = () => (
    <div className={styles.table}>
      <div className={styles.thead}>
        <div className={styles.tr}>
          <div className={styles.th}>Ім'я</div>
          <div className={styles.th}>Лінк на репозиторій</div>
          {data[0].criterias.map((criteria) => (
            <div key={criteria._id} className={styles.th} colSpan={data[0].jures.length + 1}>
              {criteria.name}
              <div className={styles.subthead}>
                {data[0].jures.map((jure) => (
                  <div key={`${criteria._id}-${jure.jureId}`} className={styles.th}>{jure.name}</div>
                ))}
                <div className={styles.th}>Середня</div>
              </div>
            </div>
          ))}
          <div className={styles.th}>Total</div>
          <div className={styles.th}>Місце</div>
        </div>
      </div>
      <div className={styles.tbody}>
        {sortedData.map((item, index) => (
          <div key={item._id} className={styles.tr}>
            <div className={styles.td}>{item.name}</div>
            <div className={styles.td}>
              <a href={item.project_link} target="_blank" rel="noopener noreferrer">Репозиторій</a>
            </div>
            {item.criterias.map((criteria) => (
              <React.Fragment key={criteria._id}>
                <div className={styles.tc}>
                {item.jures.map((jure) => {
                  const score = jure.scores.find((score) => score.criteria === criteria._id)?.score || 'N/A';
                  return <div key={`${criteria._id}-${jure.jureId}`} className={styles.td}>{score}</div>;
                })}
                <div className={styles.td}>
                  {item.avgScores[criteria._id].toFixed(2)}
                </div>
                </div>
              </React.Fragment>
            ))}
            <div className={styles.td}>{item.totalSumOfAvgScores.toFixed(2)}</div>
            <div className={styles.td}>{index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserTable = () => (
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
              {item.criterias.map((criteria, index) => {
                const score = userJure
                  ? userJure.scores.find((score) => score.criteria === criteria._id)?.score
                  : 'N/A';
                return <div key={`${criteria._id}-${index}`} className={styles.td}>{score}</div>;
              })}
              <div className={styles.td}>
                <button onClick={() => handleEdit(item)} className={styles.btn__edit}>Оцінити</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <EditForm item={currentItem} onClose={closeModal} onUpdate={onUpdate} />
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
            ) : admin ? (
              renderAdminTable()
            ) : (
              renderUserTable()
            )}
          </>
        )}
      </div>
    </>
  );
}
