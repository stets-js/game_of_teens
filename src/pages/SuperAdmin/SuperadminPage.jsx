import React, {useState, useEffect} from 'react';
import Select from 'react-select';

import SelectStyles from '../../styles/selector.module.scss';
import styles from './SuperAdminPage.module.scss';
import BgWrapper from '../../components/BgWrapper/BgWrapper';
import Table from '../../components/Table/Table';
import SuperAdminHeader from './SuperAdminHeader';
import {getAllMarathons} from '../../helpers/marathon/marathon';
import TableBody from '../../components/Table/TableTeaching';

const SuperAdministrator = () => {
  const [projects, setProjects] = useState([]);
  const [marathons, setMarathons] = useState([]);
  const [selectedMarathon, setSelectedMarathon] = useState(null);
  const fetchMarathons = async () => {
    const {data} = await getAllMarathons();
    console.log(data);
    setMarathons(data.data);
  };

  useEffect(() => {
    fetchMarathons();
  }, []);

  return (
    <>
      <SuperAdminHeader />
      <section className={styles.main_wrapper}>
        <BgWrapper title="Super administrator" />

        <Select
          className={SelectStyles.selector}
          options={marathons.map(marathon => {
            const finalWeek = marathon.blocks.filter(block => block.isFinalWeek)[0];
            return {
              label: marathon.name,
              value: marathon._id,
              finalWeek,
              juries: marathon.juries,
              criterias: marathon.criterias
            };
          })}
          onChange={e => setSelectedMarathon(e)}></Select>
        {/* <Table selectedMarathon={selectedMarathon} data={projects} admin /> */}
        <TableBody selectedMarathon={selectedMarathon} data={projects} admin />
      </section>
    </>
  );
};

export default SuperAdministrator;
