import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import styles from '../../pages/Player/PlayerPage.module.scss';
import buttonStyles from '../../styles/Button.module.scss';

import {getAllNews} from '../../helpers/news/news';
import NewsCard from './NewsCard';

export default function NewsList({
  setNewUpdate,
  newCardFlag,
  needToUpdateList,
  setNeedToUpdateList,
  newCard = false
}) {
  const userRegistered = useSelector(state => state.auth.user.registered);
  const userRole = useSelector(state => state.auth.user.role);
  const [news, setNews] = useState([]);
  const fetchAllNews = async () => {
    const {data} = await getAllNews();
    setNews(data.data);
  };
  useEffect(() => {
    fetchAllNews();
  }, []);

  useEffect(() => {
    if (needToUpdateList) {
      fetchAllNews();
      setNeedToUpdateList(false);
    }
  }, [needToUpdateList]);
  console.log(news);
  return (
    <div className={styles.player__mentor__wrapper} key={'news'}>
      <span className={styles.player__mentor__name}>
        Останні оновлення:{' '}
        {userRole === 3 && (
          <button onClick={() => setNewUpdate(true)} className={buttonStyles.button}>
            +
          </button>
        )}
      </span>
      {newCardFlag && newCard && <NewsCard oneNews={newCard}></NewsCard>}
      {news.map(oneNews => (
        <NewsCard oneNews={oneNews} />
      ))}
      <NewsCard oneNews={{title: 'Ти зарєструвався🎉', createdAt: userRegistered, marathon: []}} />
    </div>
  );
}
