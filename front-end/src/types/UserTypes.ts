export interface UserType {
  username: string;
}

export interface UserStoreType {
  user: UserType | null;
  setUser: (newUser: Partial<UserType>) => void;
}
