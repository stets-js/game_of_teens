import React, { useEffect, useState } from "react";
import styles from "./SuperAdminPage.module.scss";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import { success, error, defaults } from "@pnotify/core";
import { getAllManagersAnalytics } from "../../helpers/manager/manager";
import { TailSpin } from "react-loader-spinner";
import NoData from './NoData';
import { Link } from "react-router-dom";

export default function ManagersAnalytic() {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date().getMonth() + 1);
  const [analyticData, setAnalyticData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [team, setTeam] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

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
  const teams = [
    { value: 0, label: "All" },
    { value: 1, label: "Team 1" },
    { value: 2, label: "Team 2" },
    { value: 3, label: "Team 3" },
    { value: 4, label: "Team 4" },
    { value: 5, label: "Team 5" },
    { value: 6, label: "Team 6" },
    { value: 7, label: "Team 7" },
    { value: 8, label: "CB MIC" },
    { value: 9, label: "Without sale" },
  ];
  // Фільтрація даних за зазначеним терміном пошуку
  const filteredData = searchTerm
    ? analyticData.filter((item) => item.manager_name.includes(searchTerm))
    : analyticData;

  // Обрахунок індексів для сторінки
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Дані, що відображаються на поточній сторінці
  const filterByTeam = (data, selectedTeam) => {
    if (selectedTeam === 0) {
      return data; // Якщо обрано "All", повертаємо всі дані
    } else {
      return data.filter((item) => item.manager_team === selectedTeam); // Вибираємо менеджерів з обраною командою
    }
  };
  // const currentPageData = filteredData.slice(startIndex, endIndex);
  const currentPageData = filterByTeam(filteredData, team).slice(
    startIndex,
    endIndex
  );
  // Функція для зміни сторінки
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    setIsLoading(true);

    const getData = async (date) => {
      try {
        const res = await getAllManagersAnalytics(date);
        // Сортування за рейтингом в порядку спадання
        res.sort((a, b) => b.manager_rating - a.manager_rating);
        setAnalyticData(res);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching manager analytic data:", err);
        error(err);
        setIsLoading(false);
      }
    };
    getData(date);
  }, [date]);

  const calculateTotals = (data) => {
    let occurredTotal = 0;
    let billTotal = 0;
    let boughtTotal = 0;
    let priceTotal = 0;
  
    // Фільтруємо дані для обраної команди або для All (team === 0)
    const filteredTeamData = data.filter(item => item.manager_team === team || team === 0);
  
    // Підрахунок тоталу для обраної команди або для All
    filteredTeamData.forEach((item) => {
      occurredTotal += item.occurred_total;
      billTotal += item.bill_total;
      boughtTotal += item.bought_total;
      priceTotal += item.price_total;
    });
  
    return { occurredTotal, billTotal, boughtTotal, priceTotal };
  };
  
  const { occurredTotal, billTotal, boughtTotal, priceTotal } = calculateTotals(filteredData);
  const filteredTeamData2 = filteredData.filter(item => item.manager_team === team || team === 0);

  return (
    <>
      <Header
        endpoints={[
          { text: "List View", path: path.currentManagersList },
          { text: "Table View", path: path.currentManagersTable },
          { text: "Managers analytics", path: path.managersAnalytics },
        ]}
      />
      <div className={styles.btn__wrapper}>
        <select
          className={styles.select}
          value={teams.find((t) => t.value === team)?.label}
          onChange={(e) => {
            const selectedTeams = teams.find((t) => t.label === e.target.value);
            setTeam(+selectedTeams?.value || 0);
            setPage(1)
          }}
        >
          {teams.map((m, index) => (
            <option key={index} value={m.label}>
              {m.label}
            </option>
          ))}
        </select>
        <input
          className={styles.searchTermInput}
          type="text"
          placeholder="Search manager..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
      <div className={styles.items__container}>
      {isLoading ? (
        <div className={styles.tailspin}><TailSpin height="150px" width="150px" color="#999DFF" /></div>
      ) : currentPageData.length > 0 ? (
        currentPageData.map((item, index) => (
          <div key={index} className={styles.item__wrapper}>
            <div className={styles.item__analytic}>
              <Link
            className={styles.managerNameAnalytic}
            to={`/manager/${item.manager_id}/analytics/`}
            target="_self"
          >
            {item.manager_name}
          </Link>
            </div>
            <div className={styles.item__analytic}>
              <label>Occurred:</label>
              <p>{item.occurred_total}</p>
            </div>
            <div className={styles.item__analytic}>
              <label>Bill:</label>
              <p>{item.bill_total}</p>
            </div>
            <div className={styles.item__analytic}>
              <label>Bought:</label>
              <p>{item.bought_total}</p>
            </div>
            <div className={styles.item__analytic}>
              <label>Price:</label>
              <p>{item.price_total}</p>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.noData}>
            <NoData />
        </div>
      )}</div>
      {/* Блок з заголовком та загальною сумою */}
      <div className={styles.managerTotal}>
        <h2>Managers TOTAL:</h2>
        <div className={styles.totalItem}>
          <p>Occurred total:</p>
          <p>{occurredTotal}</p>
        </div>
        <div className={styles.totalItem}>
          <p>Bill total:</p>
          <p>{billTotal}</p>
        </div>
        <div className={styles.totalItem}>
          <p>Bought total:</p>
          <p>{boughtTotal}</p>
        </div>
        <div className={styles.totalItem}>
          <p>Price total:</p>
          <p>{priceTotal} uah</p>
        </div>
      </div>
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
}
