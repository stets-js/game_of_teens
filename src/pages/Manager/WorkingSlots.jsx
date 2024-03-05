import React, { useEffect, useState } from "react";
import styles from "./ManagerPage.module.scss";
import { getManagerWorkingSlots } from "../../helpers/manager/manager";
import {updateSlotComment} from "../../helpers/slot/slot";
import { success, error, defaults } from "@pnotify/core";
import { TailSpin } from "react-loader-spinner";
import NoData from "../SuperAdmin/NoData";

const WorkingSlots = () => {
  const manager_id = window.location.pathname.split("/")[2];
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date().getMonth() + 1);
  const [analyticData, setAnalyticData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [searchDate, setSearchDate] = useState("");
  const [showTooltip, setShowTooltip] = useState(null);

  console.log("analyticData", analyticData);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    setIsLoading(true);

    const getData = async (manager_id, date) => {
      try {
        const res = await getManagerWorkingSlots(manager_id, date);
        res.sort((a, b) => {
          let dateComparison = new Date(a.date) - new Date(b.date);
          if (dateComparison === 0) {
            return new Date(a.time) - new Date(b.time);
          }
          return dateComparison;
        });
        setAnalyticData(res);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching manager analytic data:", err);
        error(err);
        setIsLoading(false);
      }
    };
    getData(manager_id, date);
  }, [date]);

  const handleUpdate = async (slotId, message) => {
    const data = new FormData();
        data.append("id", slotId);
        data.append("message", message);
    try {
      await updateSlotComment(data).then(
        success("Comment updated!")
      );
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Фільтрація даних за зазначеним терміном пошуку
  const filteredData = searchDate
    ? analyticData.filter((item) => item.date.includes(searchDate))
    : analyticData;

  // Обрахунок індексів для сторінки
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Дані, що відображаються на поточній сторінці
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Функція для зміни сторінки
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const occurredTotal = analyticData.reduce(
    (total, item) => total + item.occurred,
    0
  );
  const billTotal = analyticData.reduce((total, item) => total + item.bill, 0);
  const boughtTotal = analyticData.reduce(
    (total, item) => total + item.bought,
    0
  );
  const priceTotal = analyticData.reduce(
    (total, item) => total + item.price,
    0
  );

  return (
    <>
      <div className={styles.btn__wrapper}>
        <input
          className={styles.searchDateInput}
          type="text"
          placeholder="Search Date YEAR-MONTH-DAY"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <select
          className={styles.select}
          value={months.find((month) => month.value === date)?.label}
          onChange={(e) => {
            const selectedMonth = months.find(
              (month) => month.label === e.target.value
            );
            setDate(+selectedMonth?.value || 1);
          }}
        >
          {months.map((m, index) => (
            <option key={index} value={m.label}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div className={styles.tailspin}>
          <TailSpin height="150px" width="150px" color="#999DFF" />
        </div>
      ) : currentPageData.length > 0 ? (
        currentPageData.map((item, index) => (
          <div className={styles.ws__wrapper}>
            <div key={index} className={styles.item__wrapper}>
              <div className={styles.item__ws}>
                <label>Date:</label>
                <p>{item.date}</p>
              </div>
              <div className={styles.item__ws}>
                <label>Time:</label>
                <p>{item.time}</p>
              </div>
              <div className={styles.item__ws}>
                <label>Comments:</label>
                <input
                  type="text"
                  value={item.comments}
                  onMouseEnter={() => setShowTooltip(index)}
                  onMouseLeave={() => setShowTooltip(null)}
                  onChange={(e) => {
                    const updatedData = [...analyticData];
                    updatedData[index].comments = e.target.value;
                    setAnalyticData(updatedData);
                  }}
                />
                {showTooltip === index && (
                  <div className={styles.comment__tooltip}>{item.comments}</div>
                )}
              </div>
              <button
                className={styles.item__btn}
                onClick={() => handleUpdate(item.id, item.comments)}
              >
                Update
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.noData}>
          <NoData />
        </div>
      )}

      {/* Кнопки пагінації */}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={endIndex >= filteredData.length}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default WorkingSlots;
