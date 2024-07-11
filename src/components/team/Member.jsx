import {useConfirm} from 'material-ui-confirm';
import styles from '../../pages/Player/PlayerPage.module.scss';

import {deletePlayerFromTeam} from '../../helpers/team/team';

import avatar from '../../img/basic_avatar.svg';
import leaderAvatar from '../../img/ledear_avatar.svg';
import deleteSVG from '../../img/delete.svg';
import invitedSVG from '../../img/invited_avatar.svg';
import {useSelector} from 'react-redux';
export default function Member({member, leader, teamId, setMyTeam, isInvitedPlayer = false}) {
  const confirm = useConfirm();
  const userId = useSelector(state => state.auth.user.id);
  const removePlayerFromTeam = (member, teamId) => {
    confirm({
      description: `Впевнені що хочете видалити участника ${member.name}?`,
      confirmationText: 'Так',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        await deletePlayerFromTeam(teamId, member._id);
        // success({delay: 1000, text: 'Cтворенно!'});
        setMyTeam(prev => {
          return {...prev, members: prev.members.filter(us => us._id !== member._id)};
        });
      })
      .catch(e => console.log('no ' + e));
  };

  return (
    <div key={member._id} className={styles.details__team__member}>
      <img
        src={isInvitedPlayer ? invitedSVG : member._id === leader._id ? leaderAvatar : avatar}
        alt="avatar"
        className={styles.avatar__small}
      />
      {!isInvitedPlayer && userId === leader._id && userId !== member._id && (
        <button
          className={styles.details__team__member__delete}
          onClick={() => {
            removePlayerFromTeam(member, teamId);
          }}>
          <img src={deleteSVG} width="24" alt="X" />
        </button>
      )}
      <label htmlFor="avatar">{member.name}</label>
    </div>
  );
}
