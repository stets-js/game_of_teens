import React, { useEffect, useState } from "react";
import styles from "./ManagerPage.module.scss";
import { getManagerAnalytic } from "../../helpers/manager/manager";

const Analytics = () => {
    const manager_id = window.location.pathname.split("/")[window.location.pathname.split("/").length - 2];
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState(new Date().getMonth() + 1);
    const [analyticData, setAnalyticData] = useState(null);
    
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
              const res = await getManagerAnalytic(manager_id, date);
              setAnalyticData(res.data);
              setIsLoading(false); 
          } catch (error) {
              console.error("Error fetching manager analytic data:", error);
              setIsLoading(false);
          }
      };
      getData(manager_id, date);

  }, [date]);

    return (
      <>
        <div className={styles.btn__wrapper}>
            <select
                className={styles.select}
                value={months.find(month => month.value === date)?.label}
                onChange={(e) => {
                    const selectedMonth = months.find(month => month.label === e.target.value);
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
        {isLoading ? <p>Loading...</p> : (
            analyticData ? <p>DATA</p> : <p>No DATA available</p>
        )}
      </>
  );
};

export default Analytics;
