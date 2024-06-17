import styles from "./Login.module.scss";
import Modal from "../../Modal/Modal";
import FormInput from "../../FormInput/FormInput";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { success, error, defaults } from "@pnotify/core";

const Login = ({ isOpen, handleClose }) => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    // try {
    //   const data = new FormData();
    //   data.append('login', login);
    //   data.append('password', password);
    //   // const res = await loginUser(data);

    //   dispatch({
    //     type: 'LOGIN_SUCCESS',
    //     payload: {
    //       token: res,
    //     },
    //   });
    //   handleClose();
    //   setLogin("");
    //   setPassword("");
    // } catch (err) {
    //   error(err.response.data.message);
    // }
  }


  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <h3 className={styles.title}>Log In</h3>
          <form>
            <FormInput
                classname={styles.title}
                title="Login:"
                type="text"
                name="login"
                value={login}
                placeholder="Login"
                isRequired={true}
                handler={setLogin}
              />

            <FormInput
              title="Password:"
              type="password"
              name="password"
              value={password}
              min={5}
              placeholder="Password"
              isRequired={true}
              handler={setPassword}
            />
            
            <button
              type="button"
              onClick={(e) => {
                const tokenFromLocalStorage = localStorage.getItem("booking");
              
                  if (tokenFromLocalStorage) {
                      dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                          token: tokenFromLocalStorage,
                        },
                      });
                  } else {
                    handleSubmit(e);
                  }
              }}
              className={styles.login}
            >
              Log in
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Login;
