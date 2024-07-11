// import {useSelector} from 'react-redux';
// import {useNavigate} from 'react-router-dom';
// import {useEffect, useState} from 'react';

// import buttonStyle from '../../styles/Button.module.scss';

// import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';

// import {getAllMarathons, getMarathonById} from '../../helpers/marathon/marathon';

// import arrow from '../../img/arrow.svg';
// import {getAllNews} from '../../helpers/news/news';

// export default function MentorPage() {
//   const [marathons, setMarathons] = useState([]);
//   const navigate = useNavigate();
//   const subscribedTo = useSelector(state => state.auth.user.subscribedTo);
//   const fetchAllMarathons = async () => {
//     if (subscribedTo && subscribedTo.length === 0) {
//       const {data} = await getAllMarathons();
//       setMarathons(data.data);
//     } else {
//       const {data} = await getMarathonById(subscribedTo[0]);
//       console.log(data);
//       setMarathons([data.data]);
//     }
//   };

//   const [mentorHours, setMentorHours] = useState([]);

//   const fetchAllMentorHourse = async () => {
//     const {data} = await getAllNews();
//     setMentorHours(data.data);
//   };
//   useEffect(() => {
//     fetchAllMarathons();
//     fetchAllMentorHourse();
//   }, []);
//   console.log(mentorHours);
//   console.log(marathons);
//   return (
//     <>
//       <div className={styles.header__container}>
//         <div className={styles.header__main}>
//           <PlayerHeader></PlayerHeader>
//           <div className={styles.main__grid}>
//             <div className={styles.player__marathons__wrapper}>
//               <span className={styles.player__marathons__name}>Категорії: </span>
//               {marathons.map(marathon => {
//                 const subscribed = (subscribedTo || []).includes(marathon._id);
//                 const blocks = marathon.blocks;
//                 return (
//                   <>
//                     <div key={marathon.id} className={styles.player__marathons__card}>
//                       <div className={styles.player__marathons__card__body}>
//                         <span>{marathon.course.name.toUpperCase()}</span>
//                         <div>
//                           {subscribed && (
//                             <span className={styles.player__marathons__subscribed}>учасник✔️</span>
//                           )}
//                           <button
//                             className={styles.player__marathons__button}
//                             onClick={() =>
//                               navigate('./courses/' + marathon._id, {
//                                 state: {marathon_state: marathon}
//                               })
//                             }>
//                             <img
//                               className={styles.player__marathons__button__svg}
//                               src={arrow}
//                               alt="arrow"
//                             />
//                           </button>
//                         </div>
//                       </div>
//                       <div className={styles.player__marathons__card__sprint}>
//                         {blocks.map(block => (
//                           <div className={styles.player__marathons__card__sprint__wrapper}>
//                             <p className={styles.details__block__container}>
//                               {block.name}
//                               <button
//                                 className={styles.details__block__arrow}
//                                 onClick={() => {
//                                   navigate(`./courses/${marathon._id}/sprint/${block._id}`, {
//                                     state: {marathon}
//                                   });
//                                 }}>
//                                 <img src={arrow} alt="arrow" />
//                               </button>
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 );
//               })}
//             </div>
//             <div className={styles.player__mentor__wrapper}>
//               <span className={styles.player__mentor__name}>Останні оновлення: </span>
//               {mentorHours.map(hour => {
//                 console.log(hour);
//                 const getId = url => {
//                   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//                   const match = url.match(regExp);

//                   return match && match[2].length === 11 ? match[2] : null;
//                 };
//                 const videoId = getId(hour.link);
//                 return (
//                   <div className={styles.player__mentor__card}>
//                     <div className={styles.player__mentor__card__title}>
//                       [{hour.course.name}]{hour.title}
//                     </div>
//                     <iframe
//                       className={styles.player__mentor__card__iframe}
//                       src={`//www.youtube.com/embed/${videoId}`}
//                       title="YouTube video player"
//                       frameborder="0"
//                       allow="accelerometer; allowfullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                       referrerpolicy="strict-origin-when-cross-origin"
//                       allowfullscreen></iframe>
//                     <div className={styles.player__mentor__card__title}>
//                       {hour.description.slice(0, 50)}
//                       {hour.description.length > 50 ? '...' : ''}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import styles from '../Player/PlayerPage.module.scss';

import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';

import {getAllMarathons} from '../../helpers/marathon/marathon';
import arrow from '../../img/arrow.svg';

import BlockList from '../../components/Block/BlockList';
import NewsList from '../../components/News/NewsList';
import PlayerPageTeam from '../../components/team/PlayerPageTeam';

export default function PlayerPage() {
  const navigate = useNavigate();

  const subscribedTo = useSelector(state => state.auth.user.subscribedTo);

  const [marathons, setMarathons] = useState([]);

  const fetchAllMarathons = async () => {
    const {data} = await getAllMarathons();
    setMarathons(data.data);
  };

  useEffect(() => {
    fetchAllMarathons();
  }, []);

  const filterMarathons = () => {
    return subscribedTo.length === 0
      ? marathons
      : marathons.filter(marathon => subscribedTo.includes(marathon._id));
  };

  return (
    <>
      <div className={styles.header__container}>
        <div className={styles.header__main}>
          <PlayerHeader></PlayerHeader>
          <div className={styles.main__grid} key={'grid'}>
            <div className={styles.player__marathons__wrapper} key={'marathon'}>
              <span className={styles.player__marathons__name} key={'label'}>
                {subscribedTo.length > 0 ? 'Моя категорія' : 'Категорії'}:{' '}
              </span>
              {filterMarathons().map(marathon => {
                const subscribed = (subscribedTo || []).includes(marathon._id);
                const slicedDesc = marathon.description.slice(0, 150);
                const blocks = marathon.blocks;
                return (
                  <>
                    <div key={marathon.id} className={styles.player__marathons__card}>
                      <div className={styles.player__marathons__card__body}>
                        <div>
                          <span>{marathon.course.name.toUpperCase()}</span>
                          <p className={styles.player__marathons__card__description}>
                            {slicedDesc}
                            {marathon.description.length > 150 ? '...' : ''}
                          </p>
                        </div>
                        <div>
                          {subscribed && (
                            <span className={styles.player__marathons__subscribed}>учасник✔️</span>
                          )}
                          <button
                            className={styles.player__marathons__button}
                            onClick={() =>
                              navigate('./courses/' + marathon._id, {
                                state: {marathon_state: marathon}
                              })
                            }>
                            <img
                              className={styles.player__marathons__button__svg}
                              src={arrow}
                              alt="arrow"
                            />
                          </button>
                        </div>
                      </div>
                      <div className={styles.player__marathons__card__sprint}>
                        {subscribed && <BlockList blocks={blocks} marathon={marathon}></BlockList>}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            <NewsList />
          </div>
        </div>
      </div>
    </>
  );
}
