import React, {useState, useEffect} from 'react';
import Select from 'react-select';

import styles from './PlayerPage.module.scss';

import buttonStyle from '../../styles/Button.module.scss';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import MarathonDescription from '../../components/Marathon/MarathonDescription';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllMarathons,
  getMarathonById,
  subscribeToMarathon
} from '../../helpers/marathon/marathon';
import {
  acceptInvite,
  deleteInvite,
  deletePlayerFromTeam,
  destroyTeam,
  getInvites,
  getMyInvites,
  getTeamAsMember,
  postTeam,
  sendInviteToTeam
} from '../../helpers/team/team';
import avatar from '../../img/basic_avatar.svg';
import leaderAvatar from '../../img/ledear_avatar.svg';
import invitedAvatar from '../../img/invited_avatar.svg';
import arrow from '../../img/arrow.svg';
import classNames from 'classnames';

import {getUsers} from '../../helpers/users/users';
import {useConfirm} from 'material-ui-confirm';
import deleteSVG from '../../img/delete.svg';

export default function CourseDetailPage() {
  const location = useLocation();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const navigate = useNavigate();
  // const {marathon_state} = location.state;
  const {courseId: marathonId} = useParams();
  // console.log(marathon_state);
  const [marathon, setMarathon] = useState(null);
  const [blocks, setBlocks] = useState(marathon?.blocks || null);
  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
  const userRole = useSelector(state => state.auth.user.role);
  const userId = useSelector(state => state.auth.user.id);
  const [userSubscribedTo, setUserSubscribedTo] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
  const [usersForInvite, setUsersForInvite] = useState([]);
  const [inviteEmail, setInviteEmail] = useState(null);
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [myInvites, setMyInvites] = useState([]);
  const [solo] = [
    '6687e00af12dbfd2229fe8d9',
    '6687df8df12dbfd2229fe8cd',
    '6687dfabf12dbfd2229fe8d0'
  ];

  const subscribeTo = async () => {
    const res = await subscribeToMarathon(userId, marathon._id);
    if (solo.includes(marathon._id)) {
      createTeam();
    }
    console.log(res);
    console.log(res.data.user.subscribedTo);
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
  const fetchMyTeam = async () => {
    const {data} = await getTeamAsMember(userId, marathonId);
    if (data.data && data.data.length > 0) setMyTeam(data.data[0]);
  };

  useEffect(() => {
    if (userRole === 2)
      // player
      fetchMyTeam();

    fetchDetails();
  }, [userRole]);

  useEffect(() => {
    if (marathon) setUserSubscribedTo((subscribedTo || []).includes(marathon?._id));
  }, [subscribedTo, marathon]);

  useEffect(() => {
    if (userSubscribedTo && myTeam && myTeam.leader._id === userId) {
      getUsersForInvite();
    }
    if (userSubscribedTo && myTeam) getinvitedUsers();
    else if (userSubscribedTo) fetchMyInvites();
  }, [myTeam, userId, userSubscribedTo]);
  const removePlayerFromTeam = (member, teamId) => {
    confirm({
      description: `Впевнені що хочете видалити участника ${member.name}?`,
      confirmationText: 'Так',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        const {data} = await deletePlayerFromTeam(teamId, member._id);
        // success({delay: 1000, text: 'Cтворенно!'});
        fetchMyTeam();
      })
      .catch(e => console.log('no ' + e));
  };
  const createTeam = async () => {
    const data = await postTeam(userId, marathon._id);
    if (data) {
      setMyTeam(data.team);
    }
  };
  const getUsersForInvite = async () => {
    const res = await getUsers(`marathonId=${subscribedTo[0]}`);
    setUsersForInvite(
      res.data.data
        .filter(user => user._id !== userId)
        .map(user => {
          return {value: user._id, label: user.email};
        })
    );
  };
  const sendInvite = async () => {
    if (!inviteEmail.value) {
      return; // !!!
    }
    try {
      const res = await sendInviteToTeam(myTeam._id, inviteEmail.value, subscribedTo[0]);
      setInvitedPlayers(prev => [...prev, res.invitation.player]);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMyInvites = async () => {
    const res = await getMyInvites(marathon._id);
    setMyInvites(res.data.data);
  };
  const getinvitedUsers = async () => {
    const invites = await getInvites(myTeam._id);
    setInvitedPlayers(prev => [...prev, ...invites.data.map(el => el.player)]);
  };
  const destroyOrLeaveTeam = async (isLeader, myTeam) => {
    confirm({
      description: `Впевнені що хочете ${isLeader ? 'видалити' : 'покинути'} команду?`,
      confirmationText: 'Так',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        if (isLeader) {
          const res = await destroyTeam(myTeam._id);
          if (res) {
            setMyTeam(null);
          }
        } else {
          const res = await deletePlayerFromTeam(myTeam._id, userId);
          if (res) setMyTeam(null);
        }
      })
      .catch(e => console.log('no ' + e));
  };
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
                  <span className={styles.details__subscribed}>Беру участь✅</span>
                ))}
            </div>
            <div className={styles.details__description}>
              <span className={styles.details__description__name}>Опис:</span>
              <div className={styles.details__description__text}>
                <MarathonDescription description={marathon.description} />
              </div>
            </div>
            {userSubscribedTo && (
              <div className={styles.details__team__wrapper}>
                <div className={styles.details__header__wrapper}>
                  <span className={styles.details__header}>Команда</span>
                  {!solo.includes(marathon._id) && myTeam && (
                    <button
                      className={buttonStyle.button}
                      onClick={() => destroyOrLeaveTeam(myTeam.leader._id === userId, myTeam)}>
                      {myTeam.leader._id === userId ? 'Видалити команду' : 'Покинути команду'}
                    </button>
                  )}
                  {!myTeam ? (
                    <button
                      className={buttonStyle.button}
                      onClick={() => {
                        createTeam();
                      }}>
                      Створити команду
                    </button>
                  ) : (
                    'В команді✅'
                  )}
                </div>

                {!myTeam ? (
                  <div className={styles.details__team}>
                    {/* <div
										className={
											styles.details__team__invintaion__wrapper
										}
									>
										<span>Запрошення</span>
										<button
											className={buttonStyle.button}
											onClick={() => {
												fetchMyInvites();
											}}
										>
											Оновити
										</button>
									</div> */}
                    <div>
                      {myInvites.length > 0 &&
                        myInvites.map(invite => (
                          <div className={styles.details__team__invintaion__card} key={invite._id}>
                            <span>
                              Учасник {invite?.team?.leader?.name} запросив(ла) тебе до команди
                            </span>

                            <div className={styles.details__team__button__wrapper}>
                              <button
                                onClick={async () => {
                                  const res = await acceptInvite(
                                    invite.team._id,
                                    invite._id,
                                    marathon._id,
                                    userId
                                  );
                                  console.log(res);
                                  setMyTeam(res.data.team);
                                }}
                                className={classNames(
                                  buttonStyle.button,
                                  styles.details__team__button__accept
                                )}>
                                Прийняти
                              </button>
                              <button
                                className={classNames(
                                  buttonStyle.button,
                                  styles.details__team__button__delete
                                )}
                                onClick={async () => {
                                  const res = await deleteInvite(invite.team._id, invite._id);
                                  if (res) fetchMyInvites();
                                }}>
                                Відмовити
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.details__team__members}>
                      {myTeam.members.map(member => (
                        <div key={member._id} className={styles.details__team__member}>
                          <img
                            src={member._id === myTeam.leader._id ? leaderAvatar : avatar}
                            alt="avatar"
                            className={styles.avatar__small}
                          />
                          {myTeam.leader._id === userId && member._id !== userId && (
                            <button
                              className={styles.details__team__member__delete}
                              onClick={() => {
                                removePlayerFromTeam(member, myTeam._id);
                              }}>
                              <img src={deleteSVG} width="24" alt="X" />
                            </button>
                          )}
                          <label htmlFor="avatar">{member.name}</label>
                        </div>
                      ))}
                      {invitedPlayers.map(member => (
                        <div key={member._id}>
                          <img src={invitedAvatar} alt="avatar" className={styles.avatar__small} />
                          <label htmlFor="avatar">{member.name}</label>
                        </div>
                      ))}
                    </div>
                    {!solo.includes(marathon._id) && myTeam.leader._id === userId && (
                      <div className={styles.details__team__input}>
                        Запросити:{' '}
                        <Select
                          options={usersForInvite}
                          key={Math.random() * 100 - 1}
                          value={inviteEmail}
                          className={styles.selector}
                          placeholder="Запроси друга до команди"
                          required
                          onChange={e => {
                            setInviteEmail(e);
                          }}
                        />
                        <button
                          className={buttonStyle.button}
                          onClick={() => {
                            sendInvite();
                          }}>
                          Відправити
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
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
              {blocks.map(block => (
                <p className={styles.details__block__container}>
                  {block.name}
                  <button
                    className={classNames(styles.details__block__arrow, buttonStyle.button)}
                    onClick={() => {
                      navigate(`./sprint/${block._id}`, {
                        state: {marathon}
                      });
                    }}>
                    <img src={arrow} alt="arrow" />
                  </button>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
