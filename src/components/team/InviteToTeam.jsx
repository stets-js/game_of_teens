import React, {useState, useEffect} from 'react';
import Select from 'react-select';

import styles from '../../pages/Player/PlayerPage.module.scss';
import {defaults, error, success} from '@pnotify/core';

import buttonStyle from '../../styles/Button.module.scss';
import {useSelector} from 'react-redux';
import {getUsers} from '../../helpers/users/users';
import {sendInviteToTeam} from '../../helpers/team/team';

export default function InviteToTeam({setInvitedPlayers, teamId}) {
  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
  const userId = useSelector(state => state.auth.user.id);
  const [usersForInvite, setUsersForInvite] = useState([]);
  const [inviteEmail, setInviteEmail] = useState(null);

  useEffect(() => {
    if (teamId) getUsersForInvite();
  }, [teamId]);

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
      const res = await sendInviteToTeam(teamId, inviteEmail.value, subscribedTo[0]);
      setInvitedPlayers(prev => [...prev, res.invitation.player]);
    } catch (e) {
      console.log(e);
      error({text: 'Цей учасник вже у іншій команді'});
    }
  };

  return (
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
  );
}
