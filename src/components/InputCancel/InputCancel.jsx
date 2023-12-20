import styles from "./InputCancel.module.scss";

const InputCancel = ({ InputCancelFunc }) => {
  return (
    <button className={styles.input__submit} onClick={InputCancelFunc}>
      Remove
    </button>
  );
};

export default InputCancel;
