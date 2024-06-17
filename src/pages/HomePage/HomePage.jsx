import { Fade } from "react-awesome-reveal";
import React from "react";
import Header from "../../components/Header/Header";
import styles from "./HomePage.module.scss";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import banner from "../../img/got_banner.png"

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("got");

    if (tokenFromLocalStorage) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: tokenFromLocalStorage,
          },
        });
    }
    
  }, [dispatch]);
  return (
    <>
      <Header endpoints={
         [{}]
        } />
      <section className={styles.home}>
        <Fade triggerOnce duration={250} direction="down">
          <div className="divider">
            <img src={banner} alt="got_banner" />
          </div>
        </Fade>
      </section>
    </>
  );
};

export default HomePage;
