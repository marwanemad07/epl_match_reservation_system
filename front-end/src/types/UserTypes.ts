export interface UserStoreType {
  username: string | null;
  setUsername: (newUsername: string | null) => void;
}
