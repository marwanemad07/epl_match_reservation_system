import { Stadium } from "./MatchSchema";
import { Reservation } from "./ReservationSchema";

export type Seat = {
  id: number;
  row: number;
  seatNumber: number;
  stadium: Stadium;
  reservations: Reservation[];
}