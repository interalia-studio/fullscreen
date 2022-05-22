import { TDUser, TldrawApp } from "@tldraw/tldraw";
import { Room } from "@y-presence/client";
import { WebsocketProvider } from "y-websocket";

import { throttle } from "lodash";
import { TldrawPresence } from "../../types";

const THROTLE_MS = 150

export default class Presence {
  room: Room;
  _handleDisconnect: Function;

  constructor(websocketProvider: WebsocketProvider) {
    this.room = new Room(websocketProvider.awareness);
  }

  connect(app: TldrawApp) {
    this._handleDisconnect = this.room.subscribe<TldrawPresence>(
      "others",
      throttle((users: any) => {
        if (!app.room) return;
        // Extract all user ids that have presence information
        const present_ids = users
          .filter((user) => user.presence)
          .map((user) => user.presence!.tdUser.id);


        const currentUser = app.room?.userId;

        // Remove users that are not present anymore
        (Object.values(app.room.users) as TDUser[]).forEach((tduser) => {
          if (
            tduser &&
            !present_ids.includes(tduser.id) &&
            tduser.id !== currentUser
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
      }, THROTLE_MS)
    );
  }

  disconnect() {
    if (this._handleDisconnect) {
      this._handleDisconnect();
    }
  }

  update = (id: string, tdUser: TDUser) => {
    if (!this.room) return;
    this.room.setPresence<TldrawPresence>({ id, tdUser });
  };
}
