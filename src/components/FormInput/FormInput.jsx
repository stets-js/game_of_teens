import styles from './FormInput.module.scss';
import React from 'react';

import classnames from 'classnames';

const FormInput = ({
  classname,
  title,
  type,
  name,
  isRequired,
  placeholder,
  value,
  handler,
  pattern,
  min,
  width,
  max,
  textArea
}) => {
  return (
    <label className={styles.input__label} style={{width: width}}>
      <p className={classnames(styles.input__title, styles[`${classname}`])}>{title}</p>
      {textArea ? (
        <textarea
          className={classnames(
            styles.autoheigh,
            styles.input__textarea,
            styles.input,
            styles[`${classname}`]
          )}
          // type={type}
          name={name}
          required={isRequired}
          value={value}
          pattern={pattern}
          minLength={min}
          maxLength={max}
          placeholder={placeholder}
          autoComplete="off"
          //min height of it
          rows={4}
          onChange={e => {
            handler(e.currentTarget.value);
          }}></textarea>
      ) : (
        <input
          className={classnames(styles.input, styles[`${classname}`])}
          type={type}
          {...(type === 'number' && {min: 0})}
          name={name}
          required={isRequired}
          value={value}
          pattern={pattern}
          minLength={min}
          maxLength={max}
          placeholder={placeholder}
          onChange={e => handler(e.currentTarget.value)}
        />
      )}
    </label>
  );
};

export default FormInput;
