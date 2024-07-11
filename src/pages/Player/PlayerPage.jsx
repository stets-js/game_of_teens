import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import styles from './PlayerPage.module.scss';

import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';

import {getAllMarathons} from '../../helpers/marathon/marathon';
import arrow from '../../img/arrow.svg';

import BlockList from '../../components/Block/BlockList';
import NewsList from '../../components/News/NewsList';
import PlayerPageTeam from '../../components/team/PlayerPageTeam';

export default function PlayerPage() {
  const navigate = useNavigate();

  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);

  const [marathons, setMarathons] = useState([]);

  const fetchAllMarathons = async () => {
    const {data} = await getAllMarathons();
    setMarathons(data.data);
  };

  useEffect(() => {
    fetchAllMarathons();
  }, []);

  const filterMarathons = () => {
    return subscribedTo.length === 0
      ? marathons
      : marathons.filter(marathon => subscribedTo.includes(marathon._id));
  };

  return (
    <>
      <div className={styles.header__container}>
        <div className={styles.header__main}>
          <PlayerHeader></PlayerHeader>
          <div className={styles.main__grid} key={'grid'}>
            <div className={styles.player__marathons__wrapper} key={'marathon'}>
              <span className={styles.player__marathons__name} key={'label'}>
                {subscribedTo.length > 0 ? 'Моя категорія' : 'Категорії'}:{' '}
              </span>
              {filterMarathons().map(marathon => {
                const subscribed = (subscribedTo || []).includes(marathon._id);
                const slicedDesc = marathon.description.slice(0, 150);
                const blocks = marathon.blocks;
                return (
                  <>
                    <div key={marathon.id} className={styles.player__marathons__card}>
                      <div className={styles.player__marathons__card__body}>
                        <div>
                          <span>{marathon.course.name.toUpperCase()}</span>
                          <p className={styles.player__marathons__card__description}>
                            {slicedDesc}
                            {marathon.description.length > 150 ? '...' : ''}
                          </p>
                        </div>
                        <div>
                          {subscribed && (
                            <span className={styles.player__marathons__subscribed}>учасник✔️</span>
                          )}
                          <button
                            className={styles.player__marathons__button}
                            onClick={() =>
                              navigate('./courses/' + marathon._id, {
                                state: {marathon_state: marathon}
                              })
                            }>
                            <img
                              className={styles.player__marathons__button__svg}
                              src={arrow}
                              alt="arrow"
                            />
                          </button>
                        </div>
                      </div>
                      <div className={styles.player__marathons__card__sprint}>
                        {subscribed && <BlockList blocks={blocks} marathon={marathon}></BlockList>}
                      </div>
                    </div>
                  </>
                );
              })}
              {subscribedTo.length > 0 && <PlayerPageTeam></PlayerPageTeam>}
            </div>
            <NewsList />
          </div>
        </div>
      </div>
    </>
  );
}
