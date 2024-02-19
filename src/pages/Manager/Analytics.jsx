import React, { useEffect, useState } from "react";
import styles from "./ManagerPage.module.scss";
import { getManagerAnalytic, updateManagerAnalytic } from "../../helpers/manager/manager";

const Analytics = () => {
    const manager_id = window.location.pathname.split("/")[2];
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState(new Date().getMonth() + 1);
    const [analyticData, setAnalyticData] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");

    console.log("analyticData", analyticData)
    
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
                setAnalyticData(res);
                setIsLoading(false); 
            } catch (error) {
                console.error("Error fetching manager analytic data:", error);
                setIsLoading(false);
            }
        };
        getData(manager_id, date);

    }, [date]);

    const handleUpdate = async (index) => {
        const updatedItem = analyticData[index];
        try {
            // Оновити дані на сервері
            // await updateManagerAnalytic(updatedItem);
            console.log("Updated item:", updatedItem);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

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

    return (
        <>
            <div className={styles.btn__wrapper}>
                <input
                className={styles.searchTermInput}
                    type="text"
                    placeholder="Search Zoho link"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                currentPageData.length > 0 ? (
                    currentPageData.map((item, index) => (
                        <div key={index} className={styles.item__wrapper}>
                            <div className={styles.item__analytic}>
                                <label>Zoho link:</label>
                                <p>{item.zoho_link}</p>
                            </div>
                            <div className={styles.item__analytic}>
                                <label>Occurred:</label>
                                <input
                                    type="number"
                                    value={item.occurred}
                                    min={0}
                                    max={1}
                                    onChange={(e) => {
                                        const updatedData = [...analyticData];
                                        updatedData[index].occurred = parseFloat(e.target.value);
                                        setAnalyticData(updatedData);
                                    }}
                                />
                            </div>
                            <div className={styles.item__analytic}>
                                <label>Bill:</label>
                                <input
                                    type="number"
                                    value={item.bill}
                                    min={0}
                                    max={1}
                                    onChange={(e) => {
                                        const updatedData = [...analyticData];
                                        updatedData[index].bill = parseFloat(e.target.value);
                                        setAnalyticData(updatedData);
                                    }}
                                />
                            </div>
                            <div className={styles.item__analytic}>
                                <label>Bought:</label>
                                <input
                                    type="number"
                                    value={item.bought}
                                    min={0}
                                    max={1}
                                    onChange={(e) => {
                                        const updatedData = [...analyticData];
                                        updatedData[index].bought = parseFloat(e.target.value);
                                        setAnalyticData(updatedData);
                                    }}
                                />
                            </div>
                            <div className={styles.item__analytic}>
                                <label>Comments:</label>
                                <input
                                    type="text"
                                    value={item.comments}
                                    onChange={(e) => {
                                        const updatedData = [...analyticData];
                                        updatedData[index].comments = e.target.value;
                                        setAnalyticData(updatedData);
                                    }}
                                />
                            </div>
                            <div className={styles.item__analytic}>
                                <label>Date:</label>
                                <p>{item.date}</p>
                            </div>
                            <div className={styles.item__analytic}>
                                <label>Time:</label>
                                <p>{item.time}</p>
                            </div>
                            <div className={styles.item__analytic}>
                                <label>Manager:</label>
                                <p>{item.manager_id}</p>
                            </div>
                            <div className={styles.item__analytic}>
                                <label>Course:</label>
                                <p>{item.course_id}</p>
                            </div>
                            <div className={styles.item__analytic}>
                                <label>YouTube:</label>
                                <input
                                    type="text"
                                    value={item.you_tube}
                                    onChange={(e) => {
                                        const updatedData = [...analyticData];
                                        updatedData[index].you_tube = e.target.value;
                                        setAnalyticData(updatedData);
                                    }}
                                />
                            </div>
                            <button className={styles.item__btn} onClick={() => handleUpdate(index)}>Update</button>
                        </div>
                    ))
                ) : <p>No DATA available</p>
            )}
            {/* Кнопки пагінації */}
            <div className={styles.pagination}>
                            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
                            <button onClick={() => handlePageChange(page + 1)} disabled={endIndex >= filteredData.length}>Next</button>
                        </div>
        </>
    );
};

export default Analytics;
