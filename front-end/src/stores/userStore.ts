import { create } from "zustand";

/**
 * Store to save and manipulate the user's data
 * ### Data
 * - **username:** holds the username to know if the user is logged in. null if he's not logged in.
 *
 * ### Functions
 * - **setUsername:** sets the username while logging in.
 */

interface UserStoreType {
  username: string | null;
  userId: string | null;
  token: string | null;
  setUsername: (newUsername: string | null) => void;
  setUserId: (newUserId: string | null) => void;
  setToken: (newToken: string | null) => void;
}

export const useUserStore = create<UserStoreType>((set) => ({
  // Initial state for the user
  username: null,
  userId: null,
  token: null,
  // Function to update the newUser
  setUsername: (newUsername) =>
    set((state) => {
      if (newUsername && newUsername !== state.username)
        // check first if the passed value isn't the same as the old one
        return { username: newUsername };
      else return state;
    }),
  setUserId: (newUserId) =>
    set((state) => {
      if (newUserId && newUserId !== state.userId)
        // check first if the passed value isn't the same as the old one
        return { userId: newUserId };
      else return state;
    }),
  setToken: (newToken) =>
    set((state) => {
      if (newToken && newToken !== state.token)
        // check first if the passed value isn't the same as the old one
        return { token: newToken };
      else return state;
    }),
  removeUser: () => set({ username: null, userId: null, token: null }),
}));
