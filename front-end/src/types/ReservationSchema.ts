import { Seat } from "./SeatSchema";

export type Reservation = {
  id: number;
  status: SeatState;
  reservedAt: string | null;
  matchId: number;
  seatId: number;
  userId: string;
  sessionId: string;
};

export type ReservationSocketMessage = {
  type: ReservationSocketMessageType;
  data: {
    seatId: number;
    matchId: number;
    seats: Seat[];
  };
};

export type ReservationSocketMessageType =
  | "SEAT_CANCELLED"
  | "SESSION_EXPIRED"
  | "SEAT_RESERVED";

export type SeatState = "CONFIRMED" | "TEMP_BOOKED" | "AVAILABLE";
