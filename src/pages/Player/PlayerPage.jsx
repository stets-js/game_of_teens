import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';

import styles from './PlayerPage.module.scss';
import buttonStyle from '../../styles/Button.module.scss';

import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';

import {getAllMarathons} from '../../helpers/marathon/marathon';

import arrow from '../../img/arrow.svg';

export default function PlayerPage() {
  const [marathons, setMarathons] = useState([]);
  const navigate = useNavigate();
  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
  const fetchAllMarathons = async () => {
    const {data} = await getAllMarathons();
    setMarathons(data.data);
  };
  useEffect(() => {
    fetchAllMarathons();
  }, []);
  return (
    <>
      <div className={styles.header__container}>
        <div className={styles.header__main}>
          <PlayerHeader></PlayerHeader>
          <div className={styles.player__marathons__wrapper}>
            {marathons.map(marathon => {
              console.log(marathon);
              const subscribed = subscribedTo.includes(marathon._id);
              const blocks = marathon.blocks;
              return (
                <>
                  <div key={marathon.id} className={styles.player__marathons__card}>
                    <div className={styles.player__marathons__card__body}>
                      <span>
                        [{marathon.course.name.toUpperCase()}] {marathon.name}
                      </span>
                      <div>
                        {subscribed && (
                          <span className={styles.details__subscribed}>учасник✅</span>
                        )}
                        <button
                          className={buttonStyle.button}
                          onClick={() =>
                            navigate('./courses/' + marathon._id, {state: {marathon}})
                          }>
                          Детальніше
                        </button>
                      </div>
                    </div>
                    <div className={styles.player__marathons__card__sprint}>
                      {subscribed &&
                        blocks.map(block => (
                          <div className={styles.player__marathons__card__sprint__wrapper}>
                            <p className={styles.details__block__container}>
                              {block.name}
                              <button
                                className={styles.details__block__arrow}
                                onClick={() => {
                                  navigate(`./courses/${marathon._id}/sprint/${block._id}`, {
                                    state: {marathon}
                                  });
                                }}>
                                <img src={arrow} alt="arrow" />
                              </button>
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
      <div></div>
    </>
  );
}
