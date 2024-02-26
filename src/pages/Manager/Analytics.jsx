import React, { useEffect, useState } from "react";
import styles from "./ManagerPage.module.scss";
import { getManagerAnalytic, updateManagerAnalytic } from "../../helpers/manager/manager";
import { success, error, defaults } from "@pnotify/core";
import { TailSpin } from "react-loader-spinner";
import NoData from '../SuperAdmin/NoData';

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
            } catch (err) {
                console.error("Error fetching manager analytic data:", err);
                error(err)
                setIsLoading(false);
            }
        };
        getData(manager_id, date);

    }, [date]);

    const handleUpdate = async (index) => {
        const updatedItem = analyticData[index];
        try {
            await updateManagerAnalytic(updatedItem).then(
              success('Analytic updated successfully')
            );
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

    const occurredTotal = analyticData.reduce((total, item) => total + item.occurred, 0);
    const billTotal = analyticData.reduce((total, item) => total + item.bill, 0);
    const boughtTotal = analyticData.reduce((total, item) => total + item.bought, 0);
    const priceTotal = analyticData.reduce((total, item) => total + item.price, 0);

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
            {isLoading ? <div className={styles.tailspin}><TailSpin height="150px" width="150px" color="#999DFF" /></div> : (
                currentPageData.length > 0 ? (
                    currentPageData.map((item, index) => (
                        <div key={index} className={styles.item__wrapper}>
                            <div className={styles.item__analytic}>
                                <label>Date:</label>
                                <p>{item.date}</p>
                            </div>
                            <div className={styles.item__analytic}>
                                <label>Zoho link:</label>
                                <p>{item.zoho_link}</p>
                            </div>
                            <div className={styles.item__analytic}>
                                <label>Course:</label>
                                <p>{item.course_name}</p>
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
                                <label>Price:</label>
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => {
                                        const updatedData = [...analyticData];
                                        updatedData[index].price = parseFloat(e.target.value);
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
                                <label>Time:</label>
                                <p>{item.time}</p>
                            </div>
                            {/* <div className={styles.item__analytic}>
                                <label>Manager:</label>
                                <p>{item.manager_id}</p>
                            </div> */}
                            
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
                ) : <div className={styles.noData}>
                <NoData />
            </div>
            )}
            {/* Блок з заголовком та загальною сумою */}
            <div className={styles.managerTotal}>
                <h2>Manager TOTAL:</h2>
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
                            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
                            <button onClick={() => handlePageChange(page + 1)} disabled={endIndex >= filteredData.length}>Next</button>
                        </div>
        </>
    );
};

export default Analytics;
