import { TDBinding, TDShape, TDUser, TldrawApp } from "@tldraw/tldraw";
import { useCallback, useEffect, useState } from "react";
import { Room } from "@y-presence/client";

import { doc, getProvider, undoManager, yBindings, yShapes } from "./store";
import type { TldrawPresence } from "./types";

export const useMultiplayerState = (sessionId: string) => {
  const [app, setApp] = useState<TldrawApp>();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState();
  const [room, setRoom] = useState();

  const onMount = useCallback(
    (app: TldrawApp) => {
      const provider = getProvider(sessionId);
      setProvider(provider);
      setRoom(new Room(provider.awareness));

      app.loadRoom(sessionId);
      app.pause();
      setApp(app);
    },
    [sessionId]
  );

  const onChangePage = useCallback(
    (
      app: TldrawApp,
      shapes: Record<string, TDShape | undefined>,
      bindings: Record<string, TDBinding | undefined>
    ) => {
      undoManager.stopCapturing();
      doc.transact(() => {
        Object.entries(shapes).forEach(([id, shape]) => {
          if (!shape) {
            yShapes.delete(id);
          } else {
            yShapes.set(shape.id, shape);
          }
        });
        Object.entries(bindings).forEach(([id, binding]) => {
          if (!binding) {
            yBindings.delete(id);
          } else {
            yBindings.set(binding.id, binding);
          }
        });
      });
    },
    []
  );

  const onUndo = useCallback(() => {
    undoManager.undo();
  }, []);

  const onRedo = useCallback(() => {
    undoManager.redo();
  }, []);

  /**
   * Callback to update user's (self) presence
   */
  const onChangePresence = useCallback((app: TldrawApp, user: TDUser) => {
    if (!app.room || !room) return;
    room.setPresence<TldrawPresence>({ id: app.room.userId, tdUser: user });
  }, []);

  /**
   * Update app users whenever there is a change in the room users
   */
  useEffect(() => {
    if (!app || !room) return;

    const unsubOthers = room.subscribe<TldrawPresence>("others", (users) => {
      if (!app.room) return;

      const ids = users
        .filter((user) => user.presence)
        .map((user) => user.presence!.tdUser.id);

      Object.values(app.room.users as TldrawPresence[]).forEach(
        (user: TldrawPresence) => {
          if (user && !ids.includes(user.id) && user.id !== app.room?.userId) {
            app.removeUser(user.id);
          }
        }
      );

      app.updateUsers(
        users
          .filter((user) => user.presence)
          .map((other) => other.presence!.tdUser)
          .filter(Boolean)
      );
    });

    return () => {
      unsubOthers();
    };
  }, [app]);

  useEffect(() => {
    if (!app) return;

    function handleDisconnect() {
      provider.disconnect();
    }

    window.addEventListener("beforeunload", handleDisconnect);

    function handleChanges() {
      app?.replacePageContent(
        Object.fromEntries(yShapes.entries()),
        Object.fromEntries(yBindings.entries()),
        {}
      );
    }

    async function setup() {
      yShapes.observeDeep(handleChanges);
      handleChanges();
      setLoading(false);
    }

    setup();

    return () => {
      window.removeEventListener("beforeunload", handleDisconnect);
      yShapes.unobserveDeep(handleChanges);
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
