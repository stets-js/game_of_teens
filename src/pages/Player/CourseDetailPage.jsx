import React, {useState, useEffect} from 'react';
import styles from './PlayerPage.module.scss';
import buttonStyle from '../../styles/Button.module.scss';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {useLocation} from 'react-router-dom';
import MarathonDescription from '../../components/Marathon/MarathonDescription';
import {useDispatch, useSelector} from 'react-redux';
import {subscribeToMarathon} from '../../helpers/marathon/marathon';
import {getTeamAsMember, postTeam, sendInviteToTeam} from '../../helpers/team/team';
import avatar from '../../img/basic_avatar.svg';
import leaderAvatar from '../../img/ledear_avatar.svg';
import {getUsers} from '../../helpers/users/users';

export default function CourseDetailPage() {
  const location = useLocation();
  const {marathon} = location.state;
  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
  const userId = useSelector(state => state.auth.user.id);
  const dispatch = useDispatch();
  const subscribeTo = async () => {
    const res = await subscribeToMarathon(userId, marathon._id);
    dispatch({type: 'CHANGE_SUBSCRIBED_TO', payload: res.data.user.subscribedTo});
  };
  const [userSubscribedTo, setUserSubscribedTo] = useState(subscribedTo.includes(marathon._id));
  const [myTeam, setMyTeam] = useState(null);
  const fetchMyTeam = async () => {
    const {data} = await getTeamAsMember(userId, marathon._id);
    if (data.data && data.data.length > 0) setMyTeam(data.data[0]);
  };
  useEffect(() => {
    setUserSubscribedTo(subscribedTo.includes(marathon._id));
  }, [subscribedTo, marathon._id]);
  useEffect(() => {
    fetchMyTeam();
  }, []);

  const [usersForInvite, setUsersForInvite] = useState([]);
  useEffect(() => {
    if (userSubscribedTo && myTeam && myTeam.leader._id === userId) {
      getUsersForInvite();
    }
  }, [myTeam, userId, userSubscribedTo]);

  const createTeam = async () => {
    const data = await postTeam(userId, marathon._id);
    if (data) {
      setMyTeam(data.team);
    }
  };
  const [inviteEmail, setInviteEmail] = useState(null);
  const getUsersForInvite = async () => {
    const res = await getUsers(`marathonId=${marathon._id}`);
    setUsersForInvite(res.data.data.filter(user => user._id !== userId));
  };

  const sendInvite = async () => {
    const user = usersForInvite.filter(user => user.email === inviteEmail);
    if (!user) {
      return; // !!!
    }
    const res = await sendInviteToTeam(myTeam._id, user[0]._id);
    console.log(res);
  };
  return (
    <>
      <PlayerHeader></PlayerHeader>
      <div className={styles.details__wrapper}>
        <div className={styles.details}>
          <div className={styles.details__header__wrapper}>
            <span className={styles.details__header}>{marathon.course.name}</span>
            {!userSubscribedTo ? (
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
          {userSubscribedTo && (
            <div className={styles.details__team__wrapper}>
              <div className={styles.details__header__wrapper}>
                <span className={styles.details__header}>Team</span>
                {!myTeam ? (
                  <button
                    className={buttonStyle.button}
                    onClick={() => {
                      createTeam();
                    }}>
                    Create team
                  </button>
                ) : (
                  'Team member✅'
                )}
              </div>

              {!myTeam ? (
                <div className={styles.details__team}>
                  <div className={styles.details__team__invintaion__wrapper}>
                    <span>Invintation</span>
                    <button className={buttonStyle.button}>Refresh</button>
                  </div>
                </div>
              ) : (
                <>
                  {' '}
                  <div>
                    {myTeam.members.map(member => (
                      <div key={member._id}>
                        <img
                          src={member._id === myTeam.leader._id ? leaderAvatar : avatar}
                          alt="avatar"
                          className={styles.avatar__small}
                        />
                        <label htmlFor="avatar">{member.name}</label>
                      </div>
                    ))}
                  </div>
                  {myTeam.leader._id === userId && (
                    <div>
                      Invite:{' '}
                      <input
                        list="invites"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}></input>
                      <datalist id="invites">
                        {usersForInvite.length > 0 &&
                          usersForInvite.map(user => <option value={user.email} />)}
                      </datalist>
                      <button
                        className={buttonStyle.button}
                        onClick={() => {
                          sendInvite();
                        }}>
                        Invite
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
