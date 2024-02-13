import React, { useState, useEffect } from "react";
import styles from "./SuperAdminPage.module.scss";
import { v4 as uuidv4 } from "uuid";
import SearchSVG from "./Search_svg";
import { getSlotsHistory } from "../../helpers/history/history";
import { TailSpin } from "react-loader-spinner";

export default function AuthLogs() {
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useState(null);
    
    const clickHandler = async () => {
        try {
          setIsLoading(true);
         const res =  await getSlotsHistory(inputValue);
         console.log(res)
         setData(res)
        } catch (error) {
          console.error("Error fetching slots:", error);
        } finally {
          setIsLoading(false);
          setInputValue("")
        }
      };

      const handleInputChange = (e) => {
        setInputValue(e.target.value);
      };


    return(
        <>
        <div className={styles.search__container}>
            <div className={styles.search__wrapper}>
            <input className={styles.search__input} type="text" placeholder="Enter manager`s name..." value={inputValue}
              onChange={handleInputChange} />
            <button className={styles.search__btn} onClick={clickHandler} type="button">{isLoading ? <TailSpin height="30px" width="30px" color="#999DFF" /> : <SearchSVG />}</button>
            </div>
        </div>
            {data && data.length > 0 ? (<>
            <div className={styles.slot__header}>
                <p className={styles.header__item}>Date</p>
                <p className={styles.header__item}>Set by</p>
                <p className={styles.header__item}>Slot date</p>
                <p className={styles.header__item}>Slot time</p>
                <p className={styles.header__item}>Manager</p>
                <p className={styles.header__item}>Status</p>
            </div>
          <div className={styles.slot__wrapper}>
            {data.map((item) => (
              <div key={uuidv4()} className={`${styles.slot__item} ${
                item.status === 1 ? styles.create :
                item.status === 0 ? styles.delete : styles.swapped
              }`}>
                <div className={styles.slot__cell}>{new Date(new Date(item.date).getTime() - 2 * 60 * 60 * 1000).toLocaleString()}</div>
                <div className={styles.slot__cell}>{item.set_by}</div>
                <div className={styles.slot__cell}>{new Date(item.slot_date).toLocaleDateString()}</div>
                <div className={styles.slot__cell}>{item.slot_time}</div>
                <div className={styles.slot__cell}>{item.manager}</div>
                <div className={styles.slot__cell}>{item.status}</div>
              </div>
            ))}
          </div>
        </>) : (<p style={{ marginTop: '100px' }}>No DATA available</p>)}
    
        </>
    )
}