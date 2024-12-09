import { UserStoreType } from "@/types/UserTypes";
import { create } from "zustand";

/**
 * Store to save and manipulate the user's data
 * ### Data
 * - **username:** holds the username to know if the user is logged in. null if he's not logged in.
 *
 * ### Functions
 * - **setUsername:** sets the username while logging in.
 */
export const useUserStore = create<UserStoreType>((set) => ({
  // Initial state for the user
  username: null,
  // Function to update the newUser
  setUsername: (newUsername) =>
    set((state) => {
      if (newUsername && newUsername !== state.username)
        // check first if the passed value isn't the same as the old one
        return { username: newUsername };
      else return state;
    }),
  removeUser: () => set({ username: null }),
}));
