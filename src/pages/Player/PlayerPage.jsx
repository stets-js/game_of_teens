
import styles from './PlayerPage.module.scss';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';


export default function PlayerPage() {

  return (
    <>
      <div className={styles.header__container}>
        <div className={styles.header__main}>
          <PlayerHeader></PlayerHeader>
          
        </div>
      </div>
      <div></div>
    </>
  );
}
