import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useConfirm } from "material-ui-confirm";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PlayerHeader from "../../components/PlayerHeader/PlayerHeader";
import styles from "./PlayerPage.module.scss";
import buttonStyles from "../../styles/Button.module.scss";
import { useSelector } from "react-redux";
import { getTeamAsMember } from "../../helpers/team/team";
import {
  createProjectToBlock,
  getProjectByTeamId,
  deleteBlockById,
} from "../../helpers/marathon/marathon";
import MDEditor from "@uiw/react-md-editor";
import { success, error, defaults } from '@pnotify/core';
import ChatComponent from "../../components/Chat/ChatComponent";
import ProjectList from "../../components/Mentor/ProjectList";
import UploadFiles from "../../components/Block/UploadFiles";
import UploadedData from "../../components/Block/UploadedDate";

export default function BlockPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { marathon } = location.state;
  const { sprintId } = useParams() || null;
  const { courseId } = useParams() || null;
  console.log("courseId", courseId);
  const userId = useSelector((state) => state.auth.user.id);
  const userRole = useSelector((state) => state.auth.user.role);
  const [block] = useState(
    marathon.blocks.filter((bl) => bl._id === sprintId)[0]
  );
  const [myProject, setMyProject] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
console.log("block", block)
  const fetchMyProject = async () => {
    try {
      const data = await getProjectByTeamId(
        marathon._id,
        block._id,
        myTeam._id
      );
      if (data) setMyProject(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyTeam = async () => {
    try {
      const { data } = await getTeamAsMember(userId, marathon._id);
      setMyTeam(data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userRole === 2) fetchMyTeam();
  }, [userRole]);

  useEffect(() => {
    if (myTeam) fetchMyProject();
  }, [myTeam]);

  const postProject = async () => {
    if (myTeam.leader._id !== userId) {
      return error({ text: "Лише лідер може це зробити", delay: 1000 });
    }
    try {
      const { data } = await createProjectToBlock(marathon._id, block._id, {
        team: myTeam._id,
      });
      setMyProject(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBlock = async (marathonId, blockId) => {
    try {
      if (marathonId && blockId) {
        await deleteBlockById(marathonId, blockId, {
          name: block.name,
          description: block.description,
        })
        success("Block successfully deleted!"); 
        navigate(`/mentor/${userId}`)       
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PlayerHeader />
      <div className={styles.block__wrapper}>
        <div className={styles.block__header}>{block.name}</div>
        <div className={styles.block__btnsWrapper}>
          <button
            className={styles.block__btn__edit}
            type="button"
            onClick={() =>
              navigate(`/mentor/${userId}/courses/${courseId}/edit_block`, {
                state: { marathon_state: marathon, title: block.name, description: block.description, blockId: block._id },
              })
            }
          >
            Edit block
          </button>
          <button
            className={styles.block__btn__delete}
            type="button"
            onClick={() => { deleteBlock(marathon._id, block._id); }}
          >
            Delete block
          </button>
        </div>
        {!myTeam && (
          <p className={classNames(styles.confirmed, styles.checkedByMentor)}>
            ⚠️Треба створити команду для здачі⚠️ (додавати людей не обов'язково)
          </p>
        )}
        {myProject && myProject.confirm && (
          <p className={classNames(styles.confirmed, styles.checkedByMentor)}>
            Здано ✔️
          </p>
        )}
        {myProject && myProject.checkedByMentor && (
          <p className={styles.checkedByMentor}>Перевірено ментором ✔️</p>
        )}
        <div data-color-mode="light" className={styles.block__description}>
          <MDEditor.Markdown
            mode="light"
            source={block.description}
            style={{ whiteSpace: "pre-wrap" }}
          />
        </div>
        {userRole === 2 &&
          (myProject ? (
            <>
              {myTeam &&
                !myProject.confirm &&
                myTeam?.leader?._id === userId && (
                  <UploadFiles
                    marathon={marathon}
                    blockId={block._id}
                    myProject={myProject}
                    setMyProject={setMyProject}
                  />
                )}
              <UploadedData
                files={myProject.files}
                links={myProject.links}
              />
            </>
          ) : (
            <>
              {myTeam && (
                <button
                  className={buttonStyles.button}
                  onClick={postProject}
                >
                  Хочеш здати? Натискай!
                </button>
              )}
            </>
          ))}
      </div>
      {myProject && myProject.confirm && (
        <ChatComponent
          chat={myProject.chat}
          leader={myTeam.leader._id}
          marathonId={marathon._id}
          blockId={block._id}
          projectId={myProject._id}
        />
      )}
      {userRole === 3 && (
        <ProjectList
          marathonId={marathon._id}
          blockId={block._id}
        />
      )}
    </>
  );
}
