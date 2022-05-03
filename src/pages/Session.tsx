import { Tldraw } from "@tldraw/tldraw";
import React from "react";
import { useParams } from "react-router-dom";

import { useEventHandlers } from "../handlers";
import { useFileSystem } from "../adapters/yjs/fileProvider";

/**
 * Wrapper for the TLDraw widget that connects to a session backend.
 */
function Editor({ sessionId }: { sessionId: string }) {
  const fileSystemHandlers = useFileSystem();
  const eventHandlers = useEventHandlers(sessionId);

  return (
    <Tldraw
      id={sessionId}
      disableAssets
      showPages={false}
      {...eventHandlers}
      {...fileSystemHandlers}
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
