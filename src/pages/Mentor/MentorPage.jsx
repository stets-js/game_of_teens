import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import styles from '../Player/PlayerPage.module.scss';

import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';

import {getAllMarathons} from '../../helpers/marathon/marathon';
import arrow from '../../img/arrow.svg';
import buttonStyles from '../../styles/Button.module.scss';
import BlockList from '../../components/Block/BlockList';
import NewsList from '../../components/News/NewsList';
import FormInput from '../../components/FormInput/FormInput';
import {createNews} from '../../helpers/news/news';

export default function PlayerPage() {
  const navigate = useNavigate();
  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
  const [marathons, setMarathons] = useState([]);

  const [newUpdateFlag, setNewUpdateFlag] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    marathon: subscribedTo,
    title: null,
    link: null,
    description: null
  });
  const [needToUpdateList, setNeedToUpdateList] = useState(false);

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
  const CreateNewNews = async () => {
    await createNews(newUpdate);
    setNeedToUpdateList(true);
  };

  return (
    <>
      <div className={styles.header__container}>
        <div className={styles.header__main}>
          <PlayerHeader></PlayerHeader>
          <div className={styles.main__grid} key={'grid'}>
            {!newUpdateFlag ? (
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
                              <span className={styles.player__marathons__subscribed}>
                                учасник✔️
                              </span>
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
                          {subscribed && (
                            <BlockList blocks={blocks} marathon={marathon}></BlockList>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            ) : (
              <div className={styles.mentor__news}>
                <div className={styles.mentor__news__container}>
                  <FormInput
                    title={'Title'}
                    value={newUpdate.title}
                    handler={e =>
                      setNewUpdate(prev => {
                        return {...prev, title: e};
                      })
                    }></FormInput>
                  <FormInput
                    title={'Link (not required)'}
                    value={newUpdate.link}
                    handler={e =>
                      setNewUpdate(prev => {
                        return {...prev, link: e};
                      })
                    }></FormInput>
                  <FormInput
                    title={'Description (not required)'}
                    textArea
                    value={newUpdate.description}
                    handler={e =>
                      setNewUpdate(prev => {
                        return {...prev, description: e};
                      })
                    }></FormInput>
                  <div className={styles.flex_and_between}>
                    <button
                      className={buttonStyles.button}
                      onClick={() => {
                        setNewUpdateFlag(false);
                        setNewUpdate({
                          marathon: subscribedTo,
                          title: null,
                          link: null,
                          description: null
                        });
                      }}>
                      Cancel
                    </button>
                    <button
                      className={buttonStyles.button}
                      onClick={() => {
                        CreateNewNews();
                      }}>
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
            <NewsList
              needToUpdateList={needToUpdateList}
              setNeedToUpdateList={setNeedToUpdateList}
              newCardFlag={newUpdateFlag}
              setNewUpdate={setNewUpdateFlag}
              newCard={newUpdate}
            />
          </div>
        </div>
      </div>
    </>
  );
}
