import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import styles from '../../pages/Player/PlayerPage.module.scss';
import buttonStyle from '../../styles/Button.module.scss';

import {getInvites, getMyInvites, getTeamAsMember, postTeam} from '../../helpers/team/team';

import InviteToTeam from '../../components/team/InviteToTeam';
import InviteActionBlock from '../../components/team/InviteActionBlock';
import MemberBlock from '../../components/team/MembersBlock';
import LeaveOrDestroyTeam from '../../components/team/LeaveOrDestroyTeam';

export default function PlayerPageTeam() {
  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
  const userId = useSelector(state => state.auth.user.id);

  const [myTeam, setMyTeam] = useState(null);
  const [myInvites, setMyInvites] = useState(null);
  const [invitedPlayers, setInvitedPlayers] = useState([]);

  const [solo] = useState(['6687e00af12dbfd2229fe8d9', '6687dfabf12dbfd2229fe8d0']);

  const fetchMyInvites = async () => {
    const res = await getMyInvites(subscribedTo[0]);
    setMyInvites(res.data.data);
  };
  const getinvitedUsers = async () => {
    const invites = await getInvites(myTeam._id);
    setInvitedPlayers(prev => [...prev, ...invites.data.map(el => el.player)]);
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
    if (myTeam) getinvitedUsers();
  }, [myTeam]);

  useEffect(() => {
    if (subscribedTo && subscribedTo.length > 0) {
      fetchMyTeam();
    }
  }, [subscribedTo]);

  useEffect(() => {
    if (subscribedTo && subscribedTo.length > 0) {
      fetchMyInvites();
    }
  }, [subscribedTo]);
  console.log('team', myTeam);
  return (
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
                    <InviteActionBlock
                      invite={invite}
                      setMyInvites={setMyInvites}
                      setMyTeam={setMyTeam}
                      fetchMyInvites={fetchMyInvites}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <div className={styles.player__team__waiting__wrapper}>
              <MemberBlock
                setMyTeam={setMyTeam}
                myTeam={myTeam}
                invitedMembers={invitedPlayers}
                fetchMyTeam={fetchMyTeam}
              />

              {!solo.includes(subscribedTo[0]) && myTeam.leader._id === userId && (
                <InviteToTeam setInvitedPlayers={setInvitedPlayers} teamId={myTeam._id} />
              )}

              {!solo.includes(subscribedTo[0]) && (
                <LeaveOrDestroyTeam myTeam={myTeam} setMyTeam={setMyTeam}></LeaveOrDestroyTeam>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
