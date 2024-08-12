import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import Select from 'react-select';
import {success} from '@pnotify/core';

import SelectStyles from '../../styles/selector.module.scss';

import Header from '../../components/Header/Header';
import BgWrapper from '../../components/BgWrapper/BgWrapper';
import styles from './JuryPage.module.scss';
import Table from '../../components/Table/Table';
import {confirmAllProjects} from '../../helpers/project/project';
import {getAllMarathons} from '../../helpers/marathon/marathon';

export default function JuryPage() {
  const userName = useSelector(state => state.auth.user.name);
  const userId = useSelector(state => state.auth.user.id);
  // const [projects, setProjects] = useState([]);
  const [marathons, setMarathons] = useState([]);
  const [selectedMarathon, setSelectedMarathon] = useState(null);
  const fetchMarathons = async id => {
    const {data} = await getAllMarathons(id ? `id=${id}` : '');
    console.log(data);
    setMarathons(data.data);
  };
  useEffect(() => {
    fetchMarathons();
  }, []);

  const updateFun = async id => {
    const {data} = await getAllMarathons(id ? `id=${id}` : '');
    const marathon = data.data[0];
    const finalWeekArr = marathon.blocks.filter(block => block.isFinalWeek);
    const finalWeek = finalWeekArr[finalWeekArr.length - 1];

    setSelectedMarathon({
      label: marathon.name,
      value: marathon._id,
      finalWeek,
      criterias: marathon.criterias,
      juries: marathon.juries
    });
  };

  console.log(selectedMarathon);
  const handleConfirm = async () => {
    try {
      const projects = selectedMarathon?.finalWeek.projects;
      const filteredProjects = projects.filter(project => {
        const jury = project.juries.find(jure => jure.jureId === userId);
        return jury && jury.scores.every(score => score.score > 0);
      });

      const formData = {projects: filteredProjects, marathonId: selectedMarathon.value};
      await confirmAllProjects(formData);
      console.log('Проекти підтверджено');
      updateFun(selectedMarathon.value);
      success({text: `Підтвердженно ${formData.projects.length} проєктів!`, delay: 1000});
    } catch (error) {
      console.error('Помилка підтвердження проєкту:', error);
    }
  };

  return (
    <>
      <Header endpoints={[]} user={{name: userName}} />
      <section className={styles.main_wrapper}>
        <BgWrapper title="Jury Page" />
        <div className={SelectStyles.selector__wrapper}>
          <Select
            className={SelectStyles.selector}
            options={marathons.map(marathon => {
              const finalWeekArr = marathon.blocks.filter(block => block.isFinalWeek);
              const finalWeek = finalWeekArr[finalWeekArr.length - 1];
              return {
                label: marathon.name,
                value: marathon._id,
                finalWeek,
                criterias: marathon.criterias,
                juries: marathon.juries
              };
            })}
            onChange={e => setSelectedMarathon(e)}></Select>
        </div>
        <Table
          // data={projects}
          selectedMarathon={selectedMarathon}
          onUpdate={() => updateFun(selectedMarathon.value)}
        />
        <button className={styles.button__confirm} type="button" onClick={handleConfirm}>
          Confirm all projects
        </button>
      </section>
    </>
  );
}
