import classNames from 'classnames';
import React from 'react';
import {useConfirm} from 'material-ui-confirm';

import styles from '../../pages/Player/PlayerPage.module.scss';
import buttonStyles from '../../styles/Button.module.scss';
import {confirmProjectToBlock} from '../../helpers/marathon/marathon';

export default function ConfirmProject({marathon, blockId, projectId, setMyProject}) {
  const confirm = useConfirm();

  const confirmProject = async () => {
    confirm({
      description: `Впевнені що завершити здачу?`,
      confirmationText: 'Так',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        const data = await confirmProjectToBlock(marathon._id, blockId, projectId);
        setMyProject(data);
      })
      .catch(e => console.log('no ' + e));
  };
  return (
    <>
      <button
        onClick={() => {
          confirmProject();
        }}
        className={classNames(buttonStyles.button, styles.block__upload__grid__fullrow)}>
        Підтвердити здачу
      </button>
    </>
  );
}
