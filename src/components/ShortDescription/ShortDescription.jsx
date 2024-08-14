import React, {useEffect, useState} from 'react';
import styles from './ShortDescription.module.scss';
export default function ShortDescription({text}) {
  const [isResized, setIsResized] = useState(false);
  const [formatText, setFormatText] = useState(text);
  useEffect(() => {
    if (text) setFormatText(isResized ? text : text.slice(0, 100) + '...');
  }, [isResized]);
  return (
    <div
      className={!isResized ? styles.small : styles.big}
      onClick={() => {
        setIsResized(!isResized);
      }}>
      {formatText}
    </div>
  );
}
