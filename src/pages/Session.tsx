import { Tldraw, useFileSystem } from "@tldraw/tldraw";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react/cjs/react.production.min";
import { useMultiplayerState } from "../useMultiplayerState";

/**
 * Wrapper for the TLDraw widget that connects to a session backend.
 */
function Editor({ sessionId }: { sessionId: string }) {
  const fileSystemEvents = useFileSystem();
  const { ...eventHandlers } = useMultiplayerState(sessionId);

  return (
    <Tldraw
      autofocus
      disableAssets
      showPages={false}
      {...fileSystemEvents}
      {...eventHandlers}
    />
  );
}

const Session = () => {
  const { sessionId } = useParams();

  return (
    <main>
      <div className="tldraw">
        <Editor sessionId={sessionId} />
      </div>
    </main>
  );
};

export default Session;
