export type Session = {
  id: string;
  userId: string;
  matchId: number;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}