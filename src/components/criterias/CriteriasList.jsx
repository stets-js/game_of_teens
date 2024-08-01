import React, {useEffect, useState} from 'react';

import {Fade} from 'react-awesome-reveal';
import ListStyles from '../../styles/list-styles.module.scss';
import {getAllCriterias} from '../../helpers/criterias/criterias';
import NewCritera from './NewCriteria';
import {Link} from 'react-router-dom';

export default function CriteriasList() {
  const [criterias, setCriterias] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const fetchCriterias = async () => {
    const {data} = await getAllCriterias();
    setCriterias(data.data);
  };

  useEffect(() => {
    fetchCriterias();
  }, []);
  return (
    <div className={ListStyles.wrapper} key={'index1'}>
      <button className={ListStyles.button__new} onClick={() => setIsOpen(true)}>
        New
      </button>
      <React.Fragment key={1}>
        <div key={'index'}>
          <ul className={ListStyles.main_wrapper}>
            {(criterias || []).map(item => {
              return (
                <Fade cascade triggerOnce duration={300} direction="up" key={item.id}>
                  <li className={ListStyles.ul_items} key={item.name}>
                    <Link className={ListStyles.ul_items_link}>
                      <p className={ListStyles.ul_items_text}>{item.name}</p>
                    </Link>
                  </li>
                </Fade>
              );
            })}
          </ul>
        </div>
      </React.Fragment>
      <NewCritera
        isOpen={isOpen}
        handleSubmit={() => fetchCriterias()}
        handleClose={() => setIsOpen(false)}
      />
    </div>
  );
}
