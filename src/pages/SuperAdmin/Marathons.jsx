import React, {useState, useEffect} from 'react';
import Select from 'react-select';

import PlayerStyles from '../Player/PlayerPage.module.scss';
import AdminStyles from './SuperAdminPage.module.scss';
import SelectorStyles from '../../styles/selector.module.scss';
import SuperAdminHeader from './SuperAdminHeader';
import {addNewJuryOrCriteria, getAllMarathons} from '../../helpers/marathon/marathon';
import {getUsers} from '../../helpers/users/users';
import {getAllCriterias} from '../../helpers/criterias/criterias';

const Marathons = () => {
  const [marathons, setMarathons] = useState([]);
  const [allJuries, setAllJuries] = useState([]);
  const [allCriterias, setAllCriterias] = useState([]);

  const fetchAllCriterias = async () => {
    const {data} = await getAllCriterias();
    setAllCriterias(
      data.data.map(el => {
        return {value: el._id, label: el.name};
      })
    );
  };
  const fetchAllMarathons = async () => {
    const {data} = await getAllMarathons();
    setMarathons(data.data);
  };

  const fetchAllUsers = async () => {
    const {data} = await getUsers('role=jury');
    setAllJuries(
      data.data.map(el => {
        return {label: el.name, value: el._id};
      })
    );
  };
  useEffect(() => {
    fetchAllUsers();
    fetchAllMarathons();
    fetchAllCriterias();
  }, []);
  const [newJuryFlag, setNewJuryFlag] = useState(-1);
  const [selectedJury, setSelectedJury] = useState(null);
  const [newCriteriaFlag, setNewCriteriaFlag] = useState(-1);
  const [selectedCriteria, setSelectedCriteria] = useState(null);

  const patchNewJuryOrCriteria = async ({marathonId, criteriaId, jureId}) => {
    const res = await addNewJuryOrCriteria({marathonId, criteriaId, jureId});
    console.log(res);
    fetchAllMarathons();
  };
  return (
    <>
      <SuperAdminHeader></SuperAdminHeader>
      <section className={AdminStyles.marathons__wrapper}>
        {marathons.map((marathon, index) => {
          const slicedDesc = marathon.description.slice(0, 600);
          const juries = marathon.juries;
          const criterias = marathon.criterias;
          return (
            <>
              <div key={marathon.id} className={PlayerStyles.player__marathons__card}>
                <div className={PlayerStyles.player__marathons__card__body}>
                  <div>
                    <span>{marathon.name.toUpperCase()}</span>
                    <p className={PlayerStyles.player__marathons__card__description}>
                      {slicedDesc}
                      {marathon.description.length > 600 ? '...' : ''}
                    </p>
                    <div>
                      <h1>
                        Журі{' '}
                        {newJuryFlag !== index && (
                          <button
                            className={AdminStyles.marathons__button}
                            onClick={() => setNewJuryFlag(index)}>
                            +
                          </button>
                        )}
                      </h1>
                      {newJuryFlag === index && (
                        <div className={AdminStyles.marathons__jury__new}>
                          <Select
                            options={allJuries}
                            onChange={e => setSelectedJury(e)}
                            className={SelectorStyles.selector}></Select>
                          <button
                            className={AdminStyles.marathons__jury__new__button}
                            onClick={() =>
                              patchNewJuryOrCriteria({
                                marathonId: marathon._id,
                                jureId: selectedJury.value
                              })
                            }>
                            Додати
                          </button>
                        </div>
                      )}
                      {juries.map(jury => (
                        <h4>
                          {jury.name} ({jury.email})
                        </h4>
                      ))}
                    </div>
                    <>
                      <h1>
                        Критерії{' '}
                        {newJuryFlag !== index && (
                          <button
                            className={AdminStyles.marathons__button}
                            onClick={() => setNewCriteriaFlag(index)}>
                            +
                          </button>
                        )}
                      </h1>
                      {newCriteriaFlag === index && (
                        <div className={AdminStyles.marathons__jury__new}>
                          <Select
                            options={allCriterias}
                            onChange={e => setSelectedCriteria(e)}
                            className={SelectorStyles.selector}></Select>
                          <button
                            className={AdminStyles.marathons__jury__new__button}
                            onClick={() =>
                              patchNewJuryOrCriteria({
                                marathonId: marathon._id,
                                criteriaId: selectedCriteria.value
                              })
                            }>
                            Додати
                          </button>
                        </div>
                      )}
                      {criterias.map(Criteria => (
                        <h4>{Criteria.name}</h4>
                      ))}
                    </>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </section>
    </>
  );
};

export default Marathons;
