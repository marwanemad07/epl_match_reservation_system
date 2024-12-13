import { Match, MatchDetails } from "@/types/MatchSchema";
import { customFetch } from "./CustomFetch";
import { Session } from "@/types/SessionSchema";

export const getAllMatches = async (): Promise<Match[]> => {
  try {
    const response = await customFetch.get("api/public/get-matches");
    console.log("response", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Couldn't get all matches", error);
    throw error;
  }
};

export const getMatchDetails = async (
  matchId: string
): Promise<MatchDetails> => {
  try {
    const response = await customFetch.get(`api/common/match/${matchId}`);
    console.log("response", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Couldn't get match details", error);
    throw new Error("Couldn't get match details"); 
  }
};

export const startMatchBookingSession = async (
  matchId: string
): Promise<Session> => {
  try {
    const response = await customFetch.post(`/api/fan/open-session`, {
      matchId: parseInt(matchId),
    });
    console.log("response", response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error)
    const err = error as { response?: { data:  { message: string } } };
    throw new Error(err.response ? err.response.data.message as unknown as string : "Couldn't start match booking session");
  }
};

export const bookSeat = async (
  sessionId: string,
  seatId: number
): Promise<void> => {
  try {
    const response = await customFetch.post(`/api/fan/reserve-seat`, {
      sessionId: sessionId,
      seatId: seatId,
    });
    console.log("response", response.data.data);
  } catch (error) {
    console.error("Couldn't book seat", error);
    throw new Error("Couldn't book seat");
  }
};

export const unBookSeat = async (
  sessionId: string,
  seatId: number
): Promise<void> => {
  try {
    const response = await customFetch.post(`/api/fan/cancel-seat-reservation`, {
      sessionId: sessionId,
      seatId: seatId,
    });
    console.log("response", response.data.data);
  } catch (error) {
    console.error("Couldn't unbook seat", error);
    throw new Error("Couldn't unbook seat");
  }
}

export const completeReservation = async (
  sessionId: string
): Promise<void> => {
  try {
    const response = await customFetch.post(`/api/fan/complete-reservation`, {
      sessionId: sessionId,
    });
    console.log("response", response.data.data);
  } catch (error) {
    console.error("Couldn't complete match booking session", error);
    throw new Error("Couldn't complete match booking session");
  }
}
