/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';

import styles from './PlayerPage.module.scss';

import buttonStyle from '../../styles/Button.module.scss';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useNavigate, useParams} from 'react-router-dom';
import MarathonDescription from '../../components/Marathon/MarathonDescription';
import {useDispatch, useSelector} from 'react-redux';
import {getMarathonById, subscribeToMarathon} from '../../helpers/marathon/marathon';
import BlockList from '../../components/Block/BlockList';
import DetailsTeamPage from '../../components/team/DetailsTeamPage';

export default function CourseDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {courseId: marathonId} = useParams();

  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
  const userRole = useSelector(state => state.auth.user.role);
  const userId = useSelector(state => state.auth.user.id);

  const [marathon, setMarathon] = useState(null);
  const [blocks, setBlocks] = useState(marathon?.blocks || null);
  const [userSubscribedTo, setUserSubscribedTo] = useState(null);
  const [solo] = useState(['6687e00af12dbfd2229fe8d9', '6687dfabf12dbfd2229fe8d0']);
  const [createSoloTeam, setCreateSoloTeam] = useState(false);

  const subscribeTo = async () => {
    const res = await subscribeToMarathon(userId, marathon._id);
    if (solo.includes(marathon._id)) {
      setCreateSoloTeam(true);
    }
    dispatch({
      type: 'CHANGE_SUBSCRIBED_TO',
      payload: res.data.user.subscribedTo
    });
  };

  useEffect(() => {
    fetchDetails();
  }, [marathonId]);

  const fetchDetails = async () => {
    const {data} = await getMarathonById(marathonId);
    setMarathon(data.data);
    setBlocks(data.data.blocks);
    setUserSubscribedTo((subscribedTo || []).includes(data.data._id));
  };

  useEffect(() => {
    fetchDetails();
  }, [userRole]);

  useEffect(() => {
    if (marathon) setUserSubscribedTo((subscribedTo || []).includes(marathon?._id));
  }, [subscribedTo, marathon]);

  return (
    <>
      <PlayerHeader></PlayerHeader>
      <div className={styles.details__wrapper}>
        {marathon && (
          <div className={styles.details}>
            <div className={styles.details__header__wrapper}>
              <span className={styles.details__header}>{marathon.course.name}</span>
              {userRole === 2 &&
                (!userSubscribedTo ? (
                  <button
                    className={buttonStyle.button}
                    onClick={() => {
                      subscribeTo();
                    }}>
                    Взяти участь
                  </button>
                ) : (
                  <span className={styles.details__subscribed}>Беру участь✔️</span>
                ))}
            </div>
            <div className={styles.details__description}>
              <span className={styles.details__description__name}>Опис:</span>
              <div className={styles.details__description__text}>
                <MarathonDescription description={marathon.description} />
              </div>
            </div>
            {userSubscribedTo && (
              <DetailsTeamPage
                createSoloTeam={createSoloTeam}
                setCreateSoloTeam={setCreateSoloTeam}
                marathon={marathon}
              />
            )}
            {userSubscribedTo && (
              <div className={styles.details__block__wrapper}>
                <span className={styles.details__block__header}>
                  Блоки{' '}
                  {userRole !== 2 && (
                    <button
                      className={buttonStyle.button}
                      onClick={() => {
                        navigate('./block', {state: {marathon}});
                      }}>
                      +
                    </button>
                  )}
                </span>{' '}
                <BlockList blocks={blocks} marathon={marathon} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
