import React, {useState, useEffect} from 'react';

import styles from '../../pages/Player/PlayerPage.module.scss';

import buttonStyle from '../../styles/Button.module.scss';
import {useSelector} from 'react-redux';
import {getInvites, getMyInvites, getTeamAsMember, postTeam} from '../../helpers/team/team';
import InviteActionBlock from '../../components/team/InviteActionBlock';
import MemberBlock from '../../components/team/MembersBlock';
import LeaveOrDestroyTeam from '../../components/team/LeaveOrDestroyTeam';
import InviteToTeam from '../../components/team/InviteToTeam';

export default function DetailsTeamPage({createSoloTeam, setCreateSoloTeam, marathon}) {
  const userRole = useSelector(state => state.auth.user.role);
  const userId = useSelector(state => state.auth.user.id);

  const [myTeam, setMyTeam] = useState(null);
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [myInvites, setMyInvites] = useState([]);
  const [solo] = useState(['6687e00af12dbfd2229fe8d9', '6687dfabf12dbfd2229fe8d0']);

  const fetchMyTeam = async () => {
    const {data} = await getTeamAsMember(userId, marathon._id);
    if (data.data && data.data.length > 0) setMyTeam(data.data[0]);
  };

  useEffect(() => {
    if (userRole === 2)
      // player
      fetchMyTeam();
  }, [userRole]);

  useEffect(() => {
    if (myTeam) getinvitedUsers();
    else fetchMyInvites();
  }, [myTeam, userId]);

  const createTeam = async () => {
    const data = await postTeam(userId, marathon._id);
    if (data) {
      setMyTeam(data.team);
    }
  };

  const fetchMyInvites = async () => {
    try {
      const res = await getMyInvites(marathon._id);
      setMyInvites(res.data.data);
    } catch (error) {}
  };
  const getinvitedUsers = async () => {
    const invites = await getInvites(myTeam._id);
    setInvitedPlayers(prev => [...prev, ...invites.data.map(el => el.player)]);
  };
  const startSoloTeam = async () => {
    await createTeam();
    setCreateSoloTeam(false);
  };
  useEffect(() => {
    if (createSoloTeam) startSoloTeam();
  }, [createSoloTeam]);
  return (
    <div className={styles.details__team__wrapper}>
      <div className={styles.details__header__wrapper}>
        <span className={styles.details__header}>Команда</span>
        {!solo.includes(marathon._id) && myTeam && (
          <LeaveOrDestroyTeam myTeam={myTeam} setMyTeam={setMyTeam} />
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
          'В команді✔️'
        )}
      </div>

      {!myTeam ? (
        <div className={styles.details__team}>
          <div>
            {myInvites.length > 0 &&
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
        <>
          <MemberBlock
            myTeam={myTeam}
            invitedMembers={invitedPlayers}
            setMyTeam={setMyTeam}
            fetchMyTeam={fetchMyTeam}></MemberBlock>

          {!solo.includes(marathon._id) && myTeam.leader._id === userId && (
            <InviteToTeam setInvitedPlayers={setInvitedPlayers} teamId={myTeam._id} />
          )}
        </>
      )}
    </div>
  );
}
