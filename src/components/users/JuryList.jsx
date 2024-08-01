import React, {useEffect, useState} from 'react';

import {Fade} from 'react-awesome-reveal';
import {Link} from 'react-router-dom';
import {getUsers} from '../../helpers/users/users';
import ListStyles from '../../styles/list-styles.module.scss';
import NewUser from './NewUser';
export default function JuryList({}) {
  const [juries, setJuries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const fetchJuries = async () => {
    const {data} = await getUsers('role=jury');
    setJuries(
      data.data.map(jury => {
        return {label: jury.name, value: jury._id, ...jury};
      })
    );
  };

  useEffect(() => {
    fetchJuries();
  }, []);
  return (
    <div className={ListStyles.wrapper} key={'index1'}>
      <button className={ListStyles.button__new} onClick={() => setIsOpen(true)}>
        New
      </button>
      <React.Fragment key={1}>
        <div key={'index'}>
          <ul className={ListStyles.main_wrapper}>
            {(juries || []).map(item => {
              return (
                <Fade cascade triggerOnce duration={300} direction="up" key={item.id}>
                  <li className={ListStyles.ul_items} key={item.name}>
                    <Link className={ListStyles.ul_items_link} target="_self" to={'#'}>
                      <p className={ListStyles.ul_items_text}>{item.name}</p>
                      <button
                        className={ListStyles.ul_items_btn}
                        // data-modal="change-user"
                        onClick={() => {
                          // setIsOpen(true);
                          // setItem({
                          //   name: item.name,
                          //   role: item.RoleId,
                          //   email: item.email,
                          //   rating: item.rating,
                          //   id: item.id
                          // });
                          // setEdit(true);
                        }}
                      />
                    </Link>
                  </li>
                </Fade>
              );
            })}
          </ul>
        </div>
      </React.Fragment>
      <NewUser
        isOpen={isOpen}
        handleSubmit={() => fetchJuries()}
        handleClose={() => setIsOpen(false)}></NewUser>
    </div>
  );
}
