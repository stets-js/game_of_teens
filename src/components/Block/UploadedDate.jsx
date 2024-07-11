import React from 'react';

import styles from '../../pages/Player/PlayerPage.module.scss';
import fileSVG from '../../img/file.svg';
import getDomainOrExtension from '../../helpers/link_shredder';

export default function UploadedData({files, links}) {
  return (
    <>
      <p className={styles.block__upload__header}> Завантажено:</p>
      <div className={styles.block__upload__grid}>
        <div className={styles.block__upload__card__wrapper}>
          {files &&
            files.length > 0 &&
            files.map(file => {
              const splited = file.split('.');
              const ext = file.split('.')[splited.length - 1].split('?')[0];
              const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
              return (
                <div className={styles.block__upload__card} key={file}>
                  <img
                    src={imageExt.includes(ext) ? file : fileSVG}
                    alt="file"
                    className={styles.block__upload__icons}
                  />
                  <a href={file}>{ext}</a>
                </div>
              );
            })}
        </div>
        <div className={styles.block__upload__grid__border}>
          {links &&
            links.length > 0 &&
            links.map(link => {
              const shortening = getDomainOrExtension(link);
              return (
                <div className={styles.block__upload__card} key={link}>
                  <a href={link}>{shortening}</a>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
