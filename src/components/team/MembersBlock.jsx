import styles from '../../pages/Player/PlayerPage.module.scss';

import Member from './Member';

export default function MemberBlock({myTeam, invitedMembers, setMyTeam}) {
  return (
    <div className={styles.details__team__members}>
      {myTeam.members.map(member => (
        <Member member={member} leader={myTeam.leader} teamId={myTeam._id} setMyTeam={setMyTeam} />
      ))}
      {invitedMembers.map(member => (
        <Member member={member} leader={myTeam.leader} teamId={myTeam._id} isInvitedPlayer />
      ))}
    </div>
  );
}
