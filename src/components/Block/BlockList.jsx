import classNames from 'classnames';
import {useNavigate} from 'react-router-dom';

import styles from '../../pages/Player/PlayerPage.module.scss';
import buttonStyle from '../../styles/Button.module.scss';

import arrow from '../../img/arrow.svg';

export default function BlockList({blocks, marathon}) {
  const navigate = useNavigate();

  return (
    <>
      {blocks.map(block => (
        <div className={styles.player__marathons__card__sprint__wrapper} key={block._id}>
          <p className={styles.details__block__container}>
            {block.name}
            <button
              className={classNames(styles.details__block__arrow, buttonStyle.button)}
              onClick={() => {
                navigate(`./courses/${marathon._id}/sprint/${block._id}`, {
                  state: {marathon}
                });
              }}>
              <img src={arrow} alt="arrow" />
            </button>
          </p>
        </div>
      ))}
    </>
  );
}
