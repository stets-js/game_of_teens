import styles from "./ChangeAppointment.module.scss";
import Modal from "../../Modal/Modal";
import React, { useState, useEffect } from "react";
import { putAppointment } from "../../../helpers/appointment/appointment";
import { getCourses } from "../../../helpers/course/course";
import { getDateByWeekId } from "../../../helpers/manager/manager";
import Select from "../../Select/Select";
import Form from "../../Form/Form";
import FormInput from "../../FormInput/FormInput";
import PostponeModal from "../PostponeModal/PostponeModal";
import ChangeAppointentManager from "../ChangeAppointentManager/ChangeAppointentManager";

const ChangeAppointment = ({
  isOpen,
  setIsOpenModal,
  handleClose,
  manager,
  id,
  course,
  crm,
  day,
  hour,
  managerIdInit,
  number,
  weekId,
  slotId,
  messageInit,
}) => {
  const [isOpenPostpone, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [courseId, setCourses] = useState("");
  const [message, setMessage] = useState("");
  const [managerId, setManagerId] = useState(managerIdInit);
  const [managerName, setManagerName] = useState(manager);
  const [age, setAge] = useState(0);
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setCourses(course);
    setPhone(number);
    setMessage(messageInit);
    setLink(crm);
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDateByWeekId(weekId, day);
        setDate(result.date);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [day, weekId]);
  return (
    <>
      <PostponeModal
        isOpen={isOpenPostpone}
        onClose={() => setIsOpen(false)}
        appointmentId={id}
        isAppointment
        link={link}
        courseId={courseId}
        day={day}
        hour={hour}
        phone={phone}
        age={age}
        slotId={slotId}
        weekId={weekId}
        message={message}
        date={date}
      />
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            isCancel={true}
            slotId={slotId}
            onSubmit={() => {
              const data = new FormData();
              data.append("crm_link", link);
              data.append("appointment_id", id);
              data.append("day", day);
              data.append("hour", hour);
              data.append("course_id", courseId);
              data.append("phone", phone);
              data.append("age", age);
              data.append("manager_id", managerId);
              data.append("week_id", weekId);
              data.append("slot_id", slotId);
              data.append("message", message);
              data.append("date", date);
              return putAppointment(data).finally(() => {
                setLink("");
                setCourses("");
                setMessage("");
                setAge(0);
                setPhone("");
                handleClose();
              });
            }}
            postpone
            postponeClick={() => setIsOpen(!isOpenPostpone)}
            handleClose={() => setIsOpenModal(!isOpen)}
            status={{
              successMessage: "Successfully created appointment",
              failMessage: "Failed to create appointment",
            }}
            type={{ type: "no-request" }}
            title="Change appointment info"
          >
            <p className={styles.input__title}>
              Manager:
              <span
                onClick={() => {
                  console.log(`should be rendered`);
                  setIsChangeOpen(!isChangeOpen);
                }}
              >
                {console.log(`${managerName} is ${managerId}`)}
                {managerName}
              </span>
            </p>
            {isChangeOpen ? (
              <ChangeAppointentManager
                isChangeAppointment={true}
                setManagerId={setManagerId}
                setManager={setManagerName}
                isOpen={isChangeOpen}
                handleClose={setIsChangeOpen}
                weekId={weekId}
                day={day}
                hour={hour}
                courseId={courseId}
                appointmentId={id}
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

export default ChangeAppointment;
