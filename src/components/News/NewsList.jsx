import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import styles from '../../pages/Player/PlayerPage.module.scss';

import {format} from 'date-fns';
import {getAllNews} from '../../helpers/news/news';
import classNames from 'classnames';
import NewsCard from './NewsCard';

export default function NewsList() {
  const userRegistered = useSelector(state => state.auth.user.registered);

  const [news, setNews] = useState([]);

  const fetchAllNews = async () => {
    const {data} = await getAllNews();
    setNews(data.data);
  };
  useEffect(() => {
    fetchAllNews();
  }, []);

  return (
    <div className={styles.player__mentor__wrapper} key={'news'}>
      <span className={styles.player__mentor__name}>Останні оновлення: </span>
      {news.map(oneNews => (
        <NewsCard oneNews={oneNews} />
      ))}
      <NewsCard oneNews={{title: 'Ти зарєструвався🎉', createdAt: userRegistered, marathon: []}} />
    </div>
  );
}
