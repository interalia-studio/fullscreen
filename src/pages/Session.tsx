import { Tldraw, useFileSystem } from "@tldraw/tldraw";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react/cjs/react.production.min";
import { useEventHandlers } from "../handlers";

/**
 * Wrapper for the TLDraw widget that connects to a session backend.
 */
function Editor({ sessionId }: { sessionId: string }) {
  const fileSystemEvents = useFileSystem();
  const eventHandlers = useEventHandlers(sessionId);

  return (
    <Tldraw
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
