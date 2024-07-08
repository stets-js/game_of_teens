import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useConfirm} from 'material-ui-confirm';
import Select from 'react-select';
import styles from './PlayerPage.module.scss';
import buttonStyle from '../../styles/Button.module.scss';

import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';

import {getAllMarathons} from '../../helpers/marathon/marathon';
import {format} from 'date-fns';
import arrow from '../../img/arrow.svg';
import {getAllMentorHours} from '../../helpers/mentor-hours/mentor-hourse';
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
import classNames from 'classnames';

import avatar from '../../img/basic_avatar.svg';
import leaderAvatar from '../../img/ledear_avatar.svg';
import invitedAvatar from '../../img/invited_avatar.svg';
import deleteSVG from '../../img/delete.svg';
import {defaults, error, success} from '@pnotify/core';

import {getUsers} from '../../helpers/users/users';

export default function PlayerPage() {
  const confirm = useConfirm();
  const [marathons, setMarathons] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [myInvites, setMyInvites] = useState(null);
  const [invitedPlayers, setInvitedPlayers] = useState([]);

  const navigate = useNavigate();

  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
  const userRegistered = useSelector(state => state.auth.user.registered);
  const userId = useSelector(state => state.auth.user.id);

  const [inviteEmail, setInviteEmail] = useState(null);
  const [solo] = useState([
    '6687e00af12dbfd2229fe8d9',
    '6687df8df12dbfd2229fe8cd',
    '6687dfabf12dbfd2229fe8d0'
  ]);

  const fetchAllMarathons = async () => {
    const {data} = await getAllMarathons();
    setMarathons(data.data);
  };
  const fetchMyInvites = async () => {
    const res = await getMyInvites(subscribedTo[0]);
    setMyInvites(res.data.data);
  };
  const [mentorHours, setMentorHours] = useState([]);
  const getinvitedUsers = async () => {
    const invites = await getInvites(myTeam._id);
    setInvitedPlayers(prev => [...prev, ...invites.data.map(el => el.player)]);
  };

  const fetchAllMentorHourse = async () => {
    const {data} = await getAllMentorHours();
    setMentorHours(data.data);
  };
  useEffect(() => {
    fetchAllMarathons();
    fetchAllMentorHourse();
  }, []);

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
  const filterMarathons = () => {
    return subscribedTo.length === 0
      ? marathons
      : marathons.filter(marathon => subscribedTo.includes(marathon._id));
  };

  const [usersForInvite, setUsersForInvite] = useState([]);
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
      error({text: 'Вибири пошту з випадаючого списка', delay: 1000});
      return; // !!!
    }
    try {
      const res = await sendInviteToTeam(myTeam._id, inviteEmail.value, subscribedTo[0]);
      setInvitedPlayers(prev => [...prev, res.invitation.player]);
    } catch (error) {
      console.log(error);
      error({text: 'Цей учасник вже у іншій команді'});
    }
  };
  const createTeam = async () => {
    const data = await postTeam(userId, subscribedTo[0]);
    if (data) {
      setMyTeam(data.team);
    }
  };

  const fetchMyTeam = async () => {
    const {data} = await getTeamAsMember(userId, subscribedTo[0]);
    if (data.data && data.data.length > 0) setMyTeam(data.data[0]);
  };

  useEffect(() => {
    if (myTeam && myTeam.leader._id === userId) {
      getUsersForInvite();
    } else if (myTeam) getinvitedUsers();
  }, [myTeam, userId]);

  useEffect(() => {
    if (subscribedTo && subscribedTo.length > 0) {
      fetchMyTeam();
      fetchMyInvites();
    }
  }, [subscribedTo]);
  console.log(inviteEmail, usersForInvite);
  return (
    <>
      <div className={styles.header__container}>
        <div className={styles.header__main}>
          <PlayerHeader></PlayerHeader>
          <div className={styles.main__grid}>
            <div className={styles.player__marathons__wrapper}>
              <span className={styles.player__marathons__name}>
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
                            <span className={styles.player__marathons__subscribed}>учасник✅</span>
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
                        {subscribed &&
                          blocks.map(block => (
                            <div className={styles.player__marathons__card__sprint__wrapper}>
                              <p className={styles.details__block__container}>
                                {block.name}
                                <button
                                  className={classNames(
                                    styles.details__block__arrow,
                                    buttonStyle.button
                                  )}
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
              {subscribedTo.length > 0 && (
                <>
                  <span className={styles.player__marathons__name}>Моя команда:</span>
                  <div key={'team'} className={styles.player__marathons__card}>
                    <div className={styles.player__marathons__card__body}>
                      {!myTeam ? (
                        <div className={styles.player__team__waiting__wrapper}>
                          <div className={styles.player__team__waiting__header}>
                            <span>Очікуй запрошення або</span>
                            <button className={buttonStyle.button} onClick={() => createTeam()}>
                              Стовирити команду
                            </button>
                          </div>
                          <div className={styles.player__team__waiting}>
                            <span className={styles.player__marathons__name}> Запрошення</span>
                            {myInvites &&
                              myInvites.map(invite => (
                                <div
                                  className={styles.details__team__invintaion__card}
                                  key={invite._id}>
                                  <span>
                                    Учасник {invite?.team?.leader?.name} запросив(ла) тебе до
                                    команди
                                  </span>

                                  <div className={styles.details__team__button__wrapper}>
                                    <button
                                      onClick={async () => {
                                        const res = await acceptInvite(
                                          invite.team._id,
                                          invite._id,
                                          subscribedTo[0],
                                          userId
                                        );
                                        console.log(res);
                                        if (res) {
                                          setMyTeam(res.data.team);
                                          setMyInvites(null);
                                        }
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
                        <div className={styles.player__team__waiting__wrapper}>
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
                                <img
                                  src={invitedAvatar}
                                  alt="avatar"
                                  className={styles.avatar__small}
                                />
                                <label htmlFor="avatar">{member.name}</label>
                              </div>
                            ))}
                          </div>

                          {!solo.includes(subscribedTo[0]) && myTeam.leader._id === userId && (
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
                              {/* <input
                            list="invites"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}></input>
                          <datalist id="invites">
                            {usersForInvite.length > 0 &&
                              usersForInvite.map(user => <option value={user.email} />)}
                          </datalist> */}
                              <button
                                className={buttonStyle.button}
                                onClick={() => {
                                  sendInvite();
                                }}>
                                Відправити
                              </button>
                            </div>
                          )}

                          {!solo.includes(subscribedTo[0]) && (
                            <button
                              className={buttonStyle.button}
                              onClick={() =>
                                destroyOrLeaveTeam(myTeam.leader._id === userId, myTeam)
                              }>
                              {myTeam.leader._id === userId
                                ? 'Видалити команду'
                                : 'Покинути команду'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={styles.player__mentor__wrapper}>
              <span className={styles.player__mentor__name}>Останні оновлення: </span>
              {mentorHours.map(hour => {
                const getId = url => {
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                  const match = url.match(regExp);

                  return match && match[2].length === 11 ? match[2] : null;
                };
                const videoId = getId(hour.link);
                return (
                  <div className={styles.player__mentor__card}>
                    <div className={styles.player__mentor__card__title}>
                      {hour.course && `[${hour.course.name}]`}
                      {hour.title}
                    </div>
                    {videoId && (
                      <iframe
                        className={styles.player__mentor__card__iframe}
                        src={`//www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; allowfullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen></iframe>
                    )}
                    <div className={styles.player__mentor__card__title}>
                      {hour.description.slice(0, 50)}
                      {hour.description.length > 50 ? '...' : ''}
                    </div>
                  </div>
                );
              })}
              <div className={styles.player__mentor__card}>
                <div
                  className={classNames(
                    styles.player__mentor__card__title,
                    styles.flex_and_between
                  )}>
                  <span>Ти зарєструвався🎉</span>
                  <span> {userRegistered && format(userRegistered, ' HH:mm dd.MM.yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
