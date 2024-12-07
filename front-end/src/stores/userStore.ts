// import { UserStoreType } from "@/types/UserTypes";
// import { create } from "zustand";

// /**
//  * Store to save and manipulate the user's data
//  * ### Data
//  * - username
//  *
//  * ### Functions
//  * - setUsername
//  */
// export const useUserStore = create<UserStoreType>((set) => ({
//   // Initial state for the user
//   user: null,
//   // Function to update the newUser
//   setUser: (newUser) =>
//     set((state) => {
//       if (state.user) return { user: { ...state.user, ...newUser } };
//       else return { user: newUser };
//     }),
//   removeUser: () => set({ user: null }),
// }));
