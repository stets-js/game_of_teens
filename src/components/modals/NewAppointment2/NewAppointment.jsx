import styles from "./NewAppointment.module.scss";
import Modal from "../../Modal/Modal";
import React, { useState, useEffect } from "react";
import { alert, notice, info, success, error } from "@pnotify/core";
import {
  getAvailableManagers,
  getCurrentAppointments,
  getManagerById,
  getDateByWeekId,
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
import { getCallerWeek } from "../../../redux/caller/caller-operations";
import ChangeAppointentManager from "../ChangeAppointentManager/ChangeAppointentManager";

const NewAppointment = ({
  isOpen,
  handleClose,
  time,
  weekId,
  dayIndex,
  slotId,
  hourIndex,
  
}) => {
  const dispatch = useDispatch();
  const [link, setLink] = useState("");
  const [courseId, setCourses] = useState("");
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


// console.log("first appointment", appointment)
//   console.log(`hourIndex ${hourIndex}`);
//   console.log(`time ${time}`);
//   console.log("appointment-->>>",appointment);
//   console.log("slotId......", slotId)


  useEffect(() => {
    !isOpen && dispatch(getCallerWeek({ weekId }));
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
        //console.log("currentDate", currentDate);
  
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
                courseId,
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
                //console.log(`should be rendered`);
                setIsChangeOpen(!isChangeOpen);
              }}
            >
              {console.log(`managerId on 140 is ${managerId}`)}
              {console.log(`manager on 140 is ${manager}`)}
              <DropList
                title="Manager"
                value={manager}
                appointment={true}
                managerIdI={managerId}
                setValue={setManager}
                setValueSecondary={setManagerId}
                request={() =>
                  getAvailableManagers(weekId, dayIndex, hourIndex)
                }
                requestAdditional={(managerId) => getManagerById(managerId)}
              />
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
                courseId={courseId}
                appointmentId={appointment.id}
                link={link}
                age={age}
                phone={phone}
                message={message}
              />
            ) : null}

            <Select
              classname={styles.select__label}
              value={courseId}
              setValue={setCourses}
              request={getCourses}
              label="course"
              defaultValue={courseId}
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
                type="Phone"
                name="Phone"
                max={13}
                value={phone}
                placeholder="Phone number"
                isRequired={true}
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
