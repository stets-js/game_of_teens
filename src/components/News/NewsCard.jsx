import {useSelector} from 'react-redux';
import styles from '../../pages/Player/PlayerPage.module.scss';

import {format} from 'date-fns';
import classNames from 'classnames';
import MarathonDescription from '../Marathon/MarathonDescription';

export default function NewsCard({oneNews}) {
  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);

  const getId = url => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  function findFirstMatch(subscribed, marathons) {
    for (let elem of subscribed) {
      const selectedMarathon = marathons.filter(marathon => marathon._id === elem);
      if (selectedMarathon[0]) return selectedMarathon[0];
    }
    return null;
  }
  if (oneNews.marathon.length !== 0) {
    const matchedMarathon = findFirstMatch(subscribedTo, oneNews.marathon);
    if (matchedMarathon === null) return;
  }
  return (
    <div className={styles.player__mentor__card} key={oneNews._id}>
      <div className={classNames(styles.player__mentor__card__title, styles.flex_and_between)}>
        <span>{oneNews.title}</span>
        <span> {oneNews.createdAt && format(oneNews.createdAt, 'HH:mm dd.MM.yyyy')}</span>
      </div>
      {oneNews.link && (
        <iframe
          className={styles.player__mentor__card__iframe}
          src={`//www.youtube.com/embed/${getId(oneNews.link)}`}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; allowfullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      )}
      <div className={styles.player__mentor__card__description}>
        <MarathonDescription description={oneNews.description} />
      </div>
    </div>
  );
}
