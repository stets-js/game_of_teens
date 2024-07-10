import React, {useEffect, useState} from 'react';

import buttonStyles from '../../styles/Button.module.scss';
import {useSelector} from 'react-redux';
import {getAllMessages, sendMessage} from '../../helpers/marathon/marathon';
import MessageCard from './MessageCard';
import styles from './Chat.module.scss';

export default function ChatComponent({chat, leader, marathonId, blockId, projectId}) {
  const userId = useSelector(state => state.auth.user.id);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const data = await getAllMessages(marathonId, blockId, projectId);
    setMessages(data);
  };
  useEffect(() => {
    if (marathonId && blockId && projectId) fetchMessages();
  }, [blockId, marathonId, projectId]);
  return (
    <>
      <div className={styles.chat__wrapper}>
        <div className={styles.chat__container}>
          {messages.length > 0 ? (
            messages.map(message => (
              <MessageCard key={message._id} leader={leader} message={message} />
            ))
          ) : (
            <div>Історія повідомлень </div>
          )}
        </div>
        {leader === userId && (
          <div className={styles.chat__sender__wrapper}>
            <textarea
              className={styles.chat__textarea}
              value={newMessage}
              onChange={e => {
                setNewMessage(e.target.value);
              }}
              placeholder="Відправити коментар"
            />
            <button
              className={buttonStyles.button}
              onClick={async () => {
                await sendMessage(marathonId, blockId, projectId, {
                  text: newMessage,
                  sender: userId
                });
                setNewMessage('');
                await fetchMessages();
              }}>
              Відправити
            </button>
          </div>
        )}
      </div>
    </>
  );
}
