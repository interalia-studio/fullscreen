import { TDUser, Tldraw } from "@tldraw/tldraw";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { TldrawApp } from "@tldraw/tldraw";
import { useCallback, useState } from "react";
import styled from "styled-components";

import { useYjsSession } from "../adapters/yjs";
import fileSystem from "../lib/fileSystem";

const ToolbarContainer = styled.div`
  background-color: var(--colors-panel);
  border-radius: var(--radii-4);
  box-shadow: var(--shadows-panel);
  padding: var(--space-2);
  border: 1px solid var(--colors-panelContrast);
  gap: 0px;
  display: flex;
  flex-direction: row;
  left: ${(props) => `${props.x}px`};
  position: absolute;
  top: ${(props) => `${props.y - props.height - 20}px`};
  visibility: ${(props) => `${props.visible ? "visible" : "hidden"}`};
  z-index: 10;

  & > span {
  }
`;

const Button = styled.button`
  width: 60px;
  height: 40px;
  margin: 5px;
`;

const Toolbar = ({ app, selection }) => {
  if (!app) return null;
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState([10, 10]);

  useEffect(() => {
    if (selection) {
      setVisible(true);
      setPos(app.page.shapes[selection[0]].point);
    } else {
      setVisible(false);
    }
  }, [selection]);

  const handleClick = useCallback(() => {
    console.log(selection);
  }, [app]);

  return (
    <ToolbarContainer x={pos[0]} y={pos[1]} height={50} visible={visible}>
      <span>
        <Button onClick={handleClick}>CLICK</Button>
      </span>
    </ToolbarContainer>
  );
};

const Board = () => {
  const { boardId } = useParams();

  const [app, setApp] = useState<TldrawApp>();
  const [selection, setSelection] = useState();
  const handleMount = useCallback(
    (app: TldrawApp) => {
      app.loadRoom(boardId);
      app.pause();
      setApp(app);
    },
    [boardId]
  );

  const handlePresence = (user: TDUser) => {
    if (user.selectedIds.length > 0) {
      setSelection(user.selectedIds);
    } else if (!selection || selection.length == 0) {
      setSelection(null);
    }
  };

  const session = useYjsSession(app, boardId, handlePresence);

  const handleNewProject = () => {
    window.location.href = `/board/${uuid()}`;
  };

  const handleOpenProject = async () => {
    const fileContents = await fileSystem.openFile();
    session.loadDocument(fileContents);
  };

  const handleSaveProject = async () => {
    const fileContents = session.serialiseDocument();
    await fileSystem.saveFile(fileContents);
  };

  return (
    <div className="tldraw">
      <Toolbar app={app} selection={selection} />
      <Tldraw
        disableAssets
        showPages={false}
        showMultiplayerMenu={false}
        readOnly={session?.isLoading}
        onMount={handleMount}
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        onSaveProject={handleSaveProject}
        showTools={false}
        {...session?.eventHandlers}
      />
    </div>
  );
};

export default Board;
