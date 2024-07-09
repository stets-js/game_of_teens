import React from 'react';
import styles from './MarathonCard.module.scss';
import playerStyles from '../../pages/Player/PlayerPage.module.scss';
import MDEditor from '@uiw/react-md-editor';
import classNames from 'classnames';

export default function MarathonDescription({description}) {
  return (
    <div className={classNames(playerStyles.block__description, styles.fullwidth)}>
      <MDEditor.Markdown
        source={description}
        className={styles.description}
        style={{whiteSpace: 'pre-wrap'}}
      />
      {/* {lines.map((line, index) =>
        line === '' ? (
          <br key={index} />
        ) : (
          <p className={styles.indented} key={index}>
            {line}
          </p>
        )
      )} */}
    </div>
  );
}
