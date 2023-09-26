import { useState, useEffect } from "react";
import styles from "./SuperAdminPage.module.scss";
import Managers from "../../components/Managers/Managers";
import MobileManagers from "../../components/MobileManagers/MobileManagers";
import NewUser from "../../components/modals/NewUser/NewUser";
import { getUsers } from "../../helpers/user/user";
// import { getManagers } from "../../helpers/manager/manager";
import { v4 as uuidv4 } from "uuid";

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState(false);

  const [data, setData] = useState([]);

  const usersArray = [
    {
      text: "Administrators",
      role: "Administrator",
      roleId: 3,
      isAdmin: false,
      isManager: false,
    },
  ];

  const handleClose = () => {
    setIsOpen(!isOpen);
  };
  const getUsersData = async () => {
    const res = [];
    const resUsers = await getUsers().then((res) =>
      res.users.filter((item) => item.role_id > 2)
    );
    const resManagers = await getUsers().then((res) =>
      res.filter((item) => (item.role_id = 2))
    );
    res.push(...resUsers);
    res.push(...resManagers);
    return setData(res);
  };

  useEffect(() => {
    getUsersData();
  }, [isOpen]);

  const screenWidth = window.innerWidth;

  console.log(`usersArray: ${JSON.stringify(usersArray)}`);
  console.log(`data: ${data}`);

  return (
    <>
      <h3 className={styles.main_title}>Manage users.</h3>
      <div className={styles.main_wrapper2}>
        {usersArray.map((item, index) => {
          return (
            <>
              {screenWidth > 1160 ? (
                <Managers
                  key={uuidv4()}
                  isOpenModal={isOpen}
                  isAdmin={item.isAdmin}
                  data={data}
                />
              ) : (
                <MobileManagers
                  key={uuidv4()}
                  isOpenModal={isOpen}
                  isAdmin={item.isAdmin}
                  data={data}
                />
              )}
            </>
          );
        })}
      </div>
      <div className={styles.btn_wrapper}>
        <button
          className={styles.add_btn}
          data-modal="new-user"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Add new administrator +
        </button>
        <NewUser
          isOpen={isOpen}
          handleClose={() => handleClose()}
          isAdmin={false}
        />
      </div>
    </>
  );
}
