import styles from "./Login.module.scss";
import Modal from "../../Modal/Modal";
import FormInput from "../../FormInput/FormInput";
import React, { useState } from "react";
import Form from "../../Form/Form";

const Login = ({ isOpen, handleClose }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  // const [remember, setRemember] = useState("");
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            onSubmit={() => {
              handleClose();
              // setRemember("");
              setLogin("");
              setPassword("");
            }}
            type={{ type: "login", button: "login" }}
            text={
              <>
                {/* <p className={styles.exit}>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    Sign Up
                  </span>
                </p>
                <p className={styles.exit}>
                  Forgot your password?{" "}
                  <span
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    Click here
                  </span>
                </p> */}
              </>
            }
            requests={{ login: loginUser }}
            // remember={remember}
            login={login}
            password={password}
            title="Log In"
          >
            
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
            {/* <label className={styles.input__label}>
              <div className={styles.checkbox__wrapper}>
                <input
                  className={styles.input}
                  type="checkbox"
                  name="remember"
                  required
                  value={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />

                <p className={styles.input__title}>Remember me</p>
              </div>
            </label> */}
          </Form>
        </Modal>
      )}
    </>
  );
};

export default Login;
