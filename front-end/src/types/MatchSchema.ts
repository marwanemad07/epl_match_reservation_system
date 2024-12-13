import { Seat } from "./SeatSchema";

export type Match = {
  id: number;
  matchDate: string;
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: Team;
  awayTeam: Team;
  mainReferee: Referee;
  linesMan1: Referee;
  linesMan2: Referee;
  stadium: Stadium;
};

type Team = {
  id: number;
  name: string;
  logo: string;
};

type Referee = {
  id: number;
  name: string;
};

export type Stadium = {
  id: number;
  name: string;
  rows: number;
  seatsPerRow: number;
};

export type MatchDetails = Match & {
  seats: Seat[];
};
