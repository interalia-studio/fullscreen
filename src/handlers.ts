import { TDBinding, TDShape, TDUser, TldrawApp } from "@tldraw/tldraw";
import { useCallback, useEffect, useState, useMemo } from "react";

import YJSSession from "./adapters/yjs/session";

export const useEventHandlers = (sessionId: string) => {
  const [app, setApp] = useState<TldrawApp>();
  const [loading, setLoading] = useState(true);

  const session = useMemo(() => {
    return new YJSSession(sessionId);
  }, [sessionId]);

  const onMount = useCallback(
    (app: TldrawApp) => {
      app.loadRoom(sessionId);
      app.pause();
      setApp(app);
    },
    [sessionId]
  );

  /**
   * Handle changes made through the TLDraw widget.
   */
  const onChangePage = useCallback(
    (
      app: TldrawApp,
      shapes: Record<string, TDShape | undefined>,
      bindings: Record<string, TDBinding | undefined>
    ) => {
      session.handleEditorChanges(app, shapes, bindings);
    },
    []
  );

  const onUndo = useCallback(() => {
    session.undo();
  }, []);

  const onRedo = useCallback(() => {
    session.redo();
  }, []);

  /**
   * Callback to update user's (self) presence
   */
  const onChangePresence = useCallback((app: TldrawApp, user: TDUser) => {
    if (!app.room) return;
    session.updatePresence(app.room.userId, user);
  }, []);

  /**
   * Update app users whenever there is a change in the room users
   */
  useEffect(() => {
    if (!app) return;

    session.connectPresence((users: any) => {
      if (!app.room) return;

      const present_ids = users
        .filter((user) => user.presence)
        .map((user) => user.presence!.tdUser.id);

      const boardOwner = app.room?.userId;

      Object.values(app.room.users as TDUser[]).forEach((tduser) => {
        if (
          tduser &&
          !present_ids.includes(tduser.id) &&
          tduser.id !== boardOwner
        ) {
          app.removeUser(tduser.id);
        }
      });

      app.updateUsers(
        users
          .filter((user) => user.presence)
          .map((other) => other.presence!.tdUser)
          .filter(Boolean)
      );
    });

    return () => {
      session.disconnectPresence();
    };
  }, [app]);

  useEffect(() => {
    if (!app) return;

    window.addEventListener("beforeunload", session.close);

    function reloadPage() {
      app?.replacePageContent(session.getShapes(), session.getBindings(), {});
    }

    async function setup() {
      session.onChanges(reloadPage);
      reloadPage();
      setLoading(false);
    }

    setup();

    return () => {
      window.removeEventListener("beforeunload", session.close);
    };
  }, [app]);

  return {
    onMount,
    onChangePage,
    onUndo,
    onRedo,
    loading,
    onChangePresence,
  };
};
