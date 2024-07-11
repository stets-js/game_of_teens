import {useSelector} from 'react-redux';
import styles from '../../pages/Player/PlayerPage.module.scss';
import buttonStyle from '../../styles/Button.module.scss';

import {acceptInvite, deleteInvite} from '../../helpers/team/team';
import classNames from 'classnames';

export default function InviteActionBlock({invite, setMyInvites, setMyTeam, fetchMyInvites}) {
  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
  const userId = useSelector(state => state.auth.user.id);

  return (
    <div className={styles.details__team__invintaion__card} key={invite._id}>
      <span>Учасник {invite?.team?.leader?.name} запросив(ла) тебе до команди</span>

      <div className={styles.details__team__button__wrapper}>
        <button
          onClick={async () => {
            const res = await acceptInvite(invite.team._id, invite._id, subscribedTo[0], userId);
            console.log(res);
            if (res) {
              setMyTeam(res.data.team);
              setMyInvites(null);
            }
          }}
          className={classNames(buttonStyle.button, styles.details__team__button__accept)}>
          Прийняти
        </button>
        <button
          className={classNames(buttonStyle.button, styles.details__team__button__delete)}
          onClick={async () => {
            const res = await deleteInvite(invite.team._id, invite._id);
            if (res) fetchMyInvites();
          }}>
          Відмовити
        </button>
      </div>
    </div>
  );
}
