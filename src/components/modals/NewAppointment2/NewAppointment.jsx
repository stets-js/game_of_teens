import styles from "./NewAppointment.module.scss";
import Modal from "../../Modal/Modal";
import React, { useState, useEffect } from "react";
import { alert, notice, info, success, error } from "@pnotify/core";
import {
  getAvailableManagers,
  getCurrentAppointments,
  getManagerById,
  getDateByWeekId,
  getAvailableManagersByCourse,
} from "../../../helpers/manager/manager";
import {
  createAppointment,
  getAppointment,
} from "../../../helpers/appointment/appointment";
import { getCourses } from "../../../helpers/course/course";
import Select from "../../Select/Select";
import Form from "../../Form/Form";
import FormInput from "../../FormInput/FormInput";
import DropList from "../../DropList/DropList";
import { useDispatch } from "react-redux";
import { getCallerWeek, getCallerWeekByCourse } from "../../../redux/caller/caller-operations";
import ChangeAppointentManager from "../ChangeAppointentManager/ChangeAppointentManager";

import { useSelector } from "react-redux";
import { getCallerDate } from "../../../redux/caller/caller-selectors";
import moment from "moment";

const NewAppointment = ({
  isOpen,
  handleClose,
  time,
  weekId,
  dayIndex,
  slotId,
  hourIndex,
  courseIdx,
}) => {
  const dispatch = useDispatch();
  const [link, setLink] = useState("");
  const [courseId, setCourses] = useState(courseIdx);
  const [manager, setManager] = useState("");
  const [appointment, setAppointment] = useState({});
  const [managerId, setManagerId] = useState("");
  const [message, setMessage] = useState("");
  const [age, setAge] = useState(0);
  const [phone, setPhone] = useState("");
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const [appointmentId, setAppointmentId] = useState(0);
  const [currentDate, setCurrentDate] = useState("");


  useEffect(() => {
    !isOpen && dispatch(getCallerWeekByCourse({ weekId, courseId: courseIdx }));
  }, [isOpen, dispatch]);

  // useEffect(() => {
  //   const get = async () => await getAppointment({ id: slotId });
  //   get().then((data) => setAppointment(data.data));
  // }, []);

  
  useEffect(() => {
    const date = async () => await getDateByWeekId(weekId, dayIndex);
    date()
      .then((data) => {
        const currentDate = data.date;  
        const get = async () => await getCurrentAppointments(currentDate);
        return get();
      })
      .then((data) => { setAppointmentData(data.data) });
  }, [isOpen]);

  // useEffect(() => {
  //   const result = appointmentData.find((appointment) => {
  //     const found = appointment.manager_appointments.some((item) => {
  //       setAppointmentId(item.id);
  //     });
  //     return found;
  //   });

  //   if (result?.managerId !== undefined) {
  //     setManagerId(result.managerId);
  //   }

  //   console.log("result-->>>",result);
  // }, [appointmentData]);
  const callerDate = new Date(useSelector(getCallerDate));
  const day = moment(callerDate).add(dayIndex, "days").date() < 10
              ? `0${moment(callerDate).add(dayIndex, "days").date()}`
              : moment(callerDate).add(dayIndex, "days").date();
  const month = moment(callerDate).add(dayIndex, "days").month() + 1 < 10
      ? `0${moment(callerDate).add(dayIndex, "days").month() + 1}`
      : moment(callerDate).add(dayIndex, "days").month() + 1;
   
      console.log("courseIdx", +courseIdx)
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            onSubmit={() => {
              const data = new FormData();
              data.append("crm_link", link);
              
              createAppointment(
                data,
                managerId,
                weekId,
                dayIndex,
                hourIndex,
                courseIdx,
                phone,
                age,
                message
              )
              .then(() => {
                success({
                  text: "Appointment successfully created",
                });
                setLink("");
                setCourses("");
                setMessage("");
                setAge(0);
                setPhone("");
                handleClose();
              })
              .catch(() => {
                error({
                  text: "This time appears to be already reserved, please change the appointment time",
                });
              });
            }}
            status={{
              successMessage: "Successfully created appointment",
              failMessage: "Failed to create appointment",
            }}
            type={{ type: "no-request" }}
            title="Create an appointment"
          >
            <span
              onClick={() => {
                setIsChangeOpen(!isChangeOpen);
              }}
            >
              <DropList
                title="Manager"
                value={manager}
                appointment={true}
                managerIdI={managerId}
                setValue={setManager}
                setValueSecondary={setManagerId}
                request={() =>
                  getAvailableManagersByCourse(weekId, dayIndex, hourIndex, +courseIdx)
                }
                requestAdditional={(managerId) => getManagerById(managerId)}
              />
            </span>
            <span className={styles.date_label}>
              Date: {day}.{month}.2023 Time: {time}:00
            </span>
            {isChangeOpen ? (
              <ChangeAppointentManager
                isCreateAppointment={true}
                setManagerId={setManagerId}
                setManager={setManager}
                isOpen={isChangeOpen}
                handleClose={setIsChangeOpen}
                weekId={weekId}
                day={dayIndex}
                hour={hourIndex}
                courseId={courseIdx}
                appointmentId={appointment.id}
                link={link}
                age={age}
                phone={phone}
                message={message}
              />
            ) : null}

            <Select
              classname={styles.select__label}
              value={courseIdx}
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
            <div className={styles.input__block}>
              <FormInput
                width="20%"
                classname="input__bottom__age"
                title="Age:"
                type="number"
                name="age"
                value={age}
                placeholder="Age"
                isRequired={true}
                handler={setAge}
              />
              <FormInput
                width="70%"
                classname="input__bottom__phone"
                title="Phone Number:"
                type="text"
                name="Phone"
                max={13}
                value={phone}
                placeholder="Phone number"
                // isRequired={true}
                handler={setPhone}
              />
            </div>
            <label className={styles.input__label}>
              <p className={styles.input__label}>Message</p>
              <textarea
                className={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </label>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewAppointment;
