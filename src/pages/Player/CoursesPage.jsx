import React, {useState, useEffect} from 'react';
import styles from './PlayerPage.module.scss';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import {getAllMarathons} from '../../helpers/marathon/marathon';
import MarathonCard from '../../components/Marathon/MarathonCard';



export default function CoursesPage() {
  const [marathons, setMarathons] = useState([]);
  const fetchAllMarathons = async () => {
    const {data} = await getAllMarathons();
    setMarathons(data.data);
  };
  useEffect(() => {
    fetchAllMarathons();
  }, []);
  return (
    <>
      <PlayerHeader></PlayerHeader>
      <div className={styles.marathons__wrapper}>
        {marathons.map(marathon => (
          <MarathonCard marathon={marathon}></MarathonCard>
        ))}
      </div>
    </>
  );
}
