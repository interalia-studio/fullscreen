import { v4 as uuid } from "uuid";

import { UserId } from "~/types";

// Key to use for storing user id in localstorage.
const LOCALSTORAGE_USER_ID_KEY = "fs-user-id";

/**
 * Returns the current user's Fullscreen user id.
 *
 * The id is stored in localstorage and a new one is created if no id was found.
 */
export const getUserId = (): UserId => {
  let storedUserId: UserId;
  try {
    storedUserId = localStorage.getItem(LOCALSTORAGE_USER_ID_KEY);
  } catch {
    console.error("Could not get user id from localStorage");
  }

  let newUserId: UserId;
  if (storedUserId == null) {
    newUserId = uuid();
    try {
      localStorage.setItem(LOCALSTORAGE_USER_ID_KEY, newUserId);
    } catch {
      console.error("Could not store user id in localStorage");
    }
  }
  return storedUserId || newUserId;
};

/**
 * Update the Fullscreen user id in localStorage.
 */
export const storeUserId = (userId: UserId) => {
  try {
    localStorage.setItem(LOCALSTORAGE_USER_ID_KEY, userId);
  } catch {
    console.error("Could not store user id");
  }
};
