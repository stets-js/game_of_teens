import {useSelector} from 'react-redux';
import {useConfirm} from 'material-ui-confirm';
import buttonStyle from '../../styles/Button.module.scss';

import {deletePlayerFromTeam, destroyTeam} from '../../helpers/team/team';

export default function LeaveOrDestroyTeam({myTeam, setMyTeam}) {
  const confirm = useConfirm();

  const userId = useSelector(state => state.auth.user.id);

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
    <button
      className={buttonStyle.button}
      onClick={() => destroyOrLeaveTeam(myTeam.leader._id === userId, myTeam)}>
      {myTeam.leader._id === userId ? 'Видалити команду' : 'Покинути команду'}
    </button>
  );
}
