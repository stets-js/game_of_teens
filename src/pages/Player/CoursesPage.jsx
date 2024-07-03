import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styles from './PlayerPage.module.scss';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import Header from '../../components/Header/Header';
import logo from '../../img/goiteensLOGO.png';
import logout from '../../img/logout.svg';
import {getAllMarathons} from '../../helpers/marathon/marathon';
import MarathonCard from '../../components/Marathon/MarathonCard';
export default function CoursesPage() {
  const userName = useSelector(state => state.auth.user.name);
  const userId = useSelector(state => state.auth.user.id);
  const dispatch = useDispatch();
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
