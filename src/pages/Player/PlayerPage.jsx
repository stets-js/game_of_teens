import styles from './PlayerPage.module.scss';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useEffect, useState} from 'react';
import {getAllMarathons} from '../../helpers/marathon/marathon';
import buttonStyle from '../../styles/Button.module.scss';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
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
              return (
                <div key={marathon.id} className={styles.player__marathons__card}>
                  <span>
                    [{marathon.course.name.toUpperCase()}] {marathon.name}
                  </span>

                  <div>
                    {subscribedTo.includes(marathon._id) && (
                      <span className={styles.details__subscribed}>підписаний✅</span>
                    )}
                    <button
                      className={buttonStyle.button}
                      onClick={() => navigate('./courses/' + marathon._id, {state: {marathon}})}>
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div></div>
    </>
  );
}
