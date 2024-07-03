import React, {useState, useEffect} from 'react';
import styles from './PlayerPage.module.scss';
import buttonStyle from '../../styles/Button.module.scss';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useLocation} from 'react-router-dom';
import MarathonDescription from '../../components/Marathon/MarathonDescription';
import {useDispatch, useSelector} from 'react-redux';
import {subscribeToMarathon} from '../../helpers/marathon/marathon';
export default function CourseDetailPage() {
  const location = useLocation();
  const {marathon} = location.state;
  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
  const userId = useSelector(state => state.auth.user.id);
  console.log(subscribedTo);
  const dispatch = useDispatch();
  const subscribeTo = async () => {
    const res = await subscribeToMarathon(userId, marathon._id);
    dispatch({type: 'CHANGE_SUBSCRIBED_TO', payload: res.data.user.subscribedTo});
  };

  return (
    <>
      <PlayerHeader></PlayerHeader>
      <div className={styles.details__wrapper}>
        <div className={styles.details}>
          <div className={styles.details__header__wrapper}>
            <span className={styles.details__header}>{marathon.course.name}</span>
            {!subscribedTo.includes(marathon._id) ? (
              <button
                className={buttonStyle.button}
                onClick={() => {
                  subscribeTo();
                }}>
                Subscribe
              </button>
            ) : (
              <span className={styles.details__subscribed}>Subscribed✅</span>
            )}
          </div>
          <div className={styles.details__description}>
            <MarathonDescription description={marathon.description} />
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
