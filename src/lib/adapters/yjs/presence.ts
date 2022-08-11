import { TDUser, TldrawApp } from "@tldraw/tldraw";
import { Room } from "@y-presence/client";
import { WebsocketProvider } from "y-websocket";
import debug from "debug";

import { throttle } from "lodash";
import { BoardId, PresenceAdapter } from "~/types";
import { useMemo } from "react";

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

export const usePresence = (websocketProvider: WebsocketProvider) => {
  return useMemo(() => {
    if (!websocketProvider) return;
    return new YPresence(websocketProvider);
  }, [websocketProvider]);
};
