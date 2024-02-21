import React, { useEffect, useState } from "react";
import styles from "./SuperAdminPage.module.scss";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import { success, error, defaults } from "@pnotify/core";
import {getAllManagersAnalytics} from "../../helpers/manager/manager";

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
  ];
// Фільтрація даних за зазначеним терміном пошуку
const filteredData = searchTerm ? analyticData.filter(item => item.zoho_link.includes(searchTerm)) : analyticData;

// Обрахунок індексів для сторінки
const startIndex = (page - 1) * perPage;
const endIndex = startIndex + perPage;

// Дані, що відображаються на поточній сторінці
const currentPageData = filteredData.slice(startIndex, endIndex);

// Функція для зміни сторінки
const handlePageChange = (newPage) => {
    setPage(newPage);
};
useEffect(() => {
    setIsLoading(true);

    const getData = async (date) => {
        try {
            const res = await getAllManagersAnalytics(date);
            setAnalyticData(res);
            setIsLoading(false); 
        } catch (err) {
            console.error("Error fetching manager analytic data:", err);
            error(err)
            setIsLoading(false);
        }
    };
    getData(date);

}, [date]);

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
    </>
  );
}
