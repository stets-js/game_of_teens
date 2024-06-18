import React, { useState, useEffect } from "react";
import classnames from "classnames";
import styles from "./Select.module.scss";

const Select = ({
  classname,
  type,
  request,
  defaultValue,
  title,
  children,
  value,
  setValue,
  manager,
}) => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const res = await request()
      .then((res) => res.data.data)
      .catch((error) => console.log(error));
    if (res === undefined) {
      setData([]);
      return;
    }
    setData(res);
    return res;
  };

  useEffect(() => {
    if (type === "no-request") {
      return;
    }
    getData();
  }, []);

  return (
    <label className={styles.input__label}>
      <p className={classnames(styles.input__title, classname)}>{title}</p>
      {type === "no-request" ? (
        <select
          multiple={false}
          className={classname ? classnames(styles.select) : styles.select}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        >
          <option value="" disabled hidden>
            {defaultValue}
          </option>
          {children}
        </select>
      ) : (
        <select
          className={
            classname ? classnames(styles.select, classname) : styles.select
          }
          value={manager && !value ? 2 : value}
          onChange={(e) => setValue(e.target.value)}
          onClick={getData}
          required
        >
          {data?.length > 0 && (
            <option value="" disabled hidden>
              {defaultValue}
            </option>
          )}
          {data.length === 0 && (
            <option value="" disabled hidden>
              Not found
            </option>
          )}

          {data.map((i) => {
            return (
              <option value={i.id} key={i.id}>
                {i.name}
              </option>
            );
          })}
        </select>
      )}
    </label>
  );
};

export default Select;
