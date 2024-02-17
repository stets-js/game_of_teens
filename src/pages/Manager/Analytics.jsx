import React, { useEffect } from "react";
import { useState } from "react";
import styles from "./ManagerPage.module.scss";
import FormInput from "../../components/FormInput/FormInput";
import Modal from "../../components/Modal/Modal";
import Select from "../../components/Select/Select";
import { TailSpin } from "react-loader-spinner";
import { getCourses } from "../../helpers/course/course";

const Analytics = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [courseId, setCourses] = useState(3);
    const [link, setLink] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [occurred, setOccurred] = useState("");
    const [bill, setBill] = useState("");
    const [bought, setBought] = useState("");
    const [payment, setPayment] = useState("");
    const [message, setMessage] = useState("");
    const [youtube, setYoutube] = useState("");
    
    const possibleTime = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",

      ];
    return (
    <>
     {isOpen && (<Modal open={isOpen} onClose={()=>setIsOpen(false)}>
     {isLoading ? <div className={styles.loadingBackdrop}><TailSpin height="150px" width="150px" color="#999DFF" /></div> : null}
     <h3 className={styles.title}>Add new analytic</h3>
            <FormInput
              title="Date:"
              type="text"
              name="date"
              value={date}
              placeholder="01.01.2024"
              isRequired={true}
              handler={setDate}
            />
            <label className={styles.input__label}>
            <p className={styles.input__title}>Time:</p>
            <select
                className={styles.select}
                value={time}
                onChange={(e) => {
                    setTime(e.target.value)
                }}
              >
                {possibleTime.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select></label>
            <Select
              classname={styles.select__label}
              value={courseId}
              setValue={setCourses}
              request={getCourses}
              label="course"
              defaultValue="Select course"
              title="Course:"
            />
            <FormInput
              title="CRM link:"
              type="text"
              name="link"
              value={link}
              placeholder=""
              isRequired={true}
              handler={setLink}
            />
            <FormInput
              title="Occurred:"
              type="text"
              name="occurred"
              value={occurred}
              placeholder=""
              isRequired={true}
              handler={setOccurred}
            />
            <FormInput
              title="Bill:"
              type="text"
              name="bill"
              value={bill}
              placeholder=""
              isRequired={true}
              handler={setBill}
            />
            <FormInput
              title="Bought:"
              type="text"
              name="bought"
              value={bought}
              placeholder=""
              isRequired={true}
              handler={setBought}
            />
            <FormInput
              title="Payment amount:"
              type="text"
              name="payment"
              value={payment}
              placeholder=""
              isRequired={true}
              handler={setPayment}
            />
            <label className={styles.input__label}>
              <p className={styles.input__label}>Message</p>
              <textarea
                className={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </label>
            <FormInput
              title="YouTube link:"
              type="text"
              name="youtube"
              value={youtube}
              placeholder=""
              isRequired={true}
              handler={setYoutube}
            />
            <button className={styles.form__btn}>Add new</button>
     <form>

     </form>
     </Modal>)}
        <div className={styles.btn__wrapper}>
            <button className={styles.page__btn}
            onClick={()=>{
                setIsOpen(true)
            }}>
                + Add new
            </button>
            <button className={styles.page__btn}>
                Refresh
            </button>
        </div>
    </>
  );
};

export default Analytics;
