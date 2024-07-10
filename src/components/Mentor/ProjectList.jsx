import React, {useEffect, useState} from 'react';
import {getProjectsFromBlock} from '../../helpers/marathon/marathon';
import getDomainOrExtension from '../../helpers/link_shredder';

export default function ProjectList({marathonId, blockId}) {
  const [projects, setProjects] = useState([]);
  const fetchAllTeams = async () => {
    const res = await getProjectsFromBlock(marathonId, blockId);
    console.log(res);
    setProjects(res);
  };
  useEffect(() => {
    fetchAllTeams();
  }, []);
  return (
    <>
      {projects.length > 0 &&
        projects.map(project => {
          console.log(project);
          return (
            <div>
              <span>
                Команда {project.team.leader.name} ({project.team.leader.email})
              </span>
              <div>
                {project.files.map(file => (
                  <a href={file}> {getDomainOrExtension(file)}</a>
                ))}
              </div>
              <div>
                {project.links.map(link => (
                  <a href={link}> {getDomainOrExtension(link)}</a>
                ))}
              </div>
            </div>
          );
        })}
    </>
  );
}
