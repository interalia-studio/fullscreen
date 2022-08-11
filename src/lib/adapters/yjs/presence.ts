import { TDUser, TldrawApp } from "@tldraw/tldraw";
import { Room } from "@y-presence/client";
import { WebsocketProvider } from "y-websocket";
import debug from "debug";

import { throttle } from "lodash";
import { BoardId, FSUser, PresenceAdapter } from "~/types";
import { useCallback, useMemo } from "react";

// Limit the frequency of presence updates so delays don't add up
// and participant cursors get out of sync.
const THROTTLE_MS = 150;

const log = debug("fs:yjs:presence");

export default class YPresence implements PresenceAdapter {
  room: Room;
  _handleDisconnect: Function;

  constructor(websocketProvider: WebsocketProvider) {
    this.room = new Room(websocketProvider.awareness, null);
  }

  connect(app: TldrawApp) {
    log("connecting");
    this._handleDisconnect = this.room.subscribe(
      "others",
      throttle((users: any) => {
        if (!app.room) return;

        log("updating");

        // Extract all TD user ids that have presence information
        const presentTdIds = users
          .filter((user) => user.presence)
          .map((user) => user.presence!.tdUser.id);

        // Remove users from app state that are not present anymore
        (Object.values(app.room.users) as TDUser[]).forEach((tduser) => {
          if (
            tduser &&
            !presentTdIds.includes(tduser.id) &&
            tduser.id !== app.room.userId // don't remove self?
          ) {
            app.removeUser(tduser.id);
          }
        });

        // Update all other users
        app.updateUsers(
          users
            .filter((user) => user.presence)
            .map((other) => other.presence!.tdUser)
            .filter(Boolean)
        );
      }, THROTTLE_MS)
    );
  }

  disconnect() {
    if (this._handleDisconnect) {
      log("disconnecting");
      this._handleDisconnect();
    }
  }

  update = (id: string, tdUser: TDUser) => {
    if (!this.room) return;
    this.room.setPresence({ id, tdUser });
  };
}

/**
 * Provides callbacks for broadcasting presence information.
 *
 * No presence is broadcast when `passiveMode` is true or `fsUser` is not set.
 *
 * A connection is established whenever the Websocket provider changes.
 */
export const usePresence = (
  websocketProvider: WebsocketProvider,
  passiveMode: boolean,
  fsUser: FSUser
) => {
  const presence = useMemo(() => {
    if (!websocketProvider) return;
    return new YPresence(websocketProvider);
  }, [websocketProvider]);

  const connect = useCallback(
    (app: TldrawApp) => {
      presence?.connect(app);
    },
    [presence]
  );

  const update = useCallback(
    (userPresence: TDUser) => {
      if (!passiveMode && presence) {
        presence?.update(fsUser.id, userPresence);
      }
    },
    [presence, passiveMode, fsUser]
  );

  const disconnect = useCallback(() => {
    presence?.disconnect();
  }, [presence]);

  return {
    connect,
    update,
    disconnect,
  };
};
