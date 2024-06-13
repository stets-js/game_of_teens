import styles from "./InputSubmit.module.scss";

const InputSubmit = ({buttonTitle, disabled}) => {
  return <input disabled={disabled} className={styles.input__submit} type="submit" value={buttonTitle} />;
};

export default InputSubmit;
