import SeatBookingGrid from "@/components/match/SeatBookingGrid";
import {
  completeReservation,
  getMatchDetails,
  startMatchBookingSession,
} from "@/lib/requests/MatchesQueries";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { bookSeat, unBookSeat } from "@/lib/requests/MatchesQueries";
import { toast } from "react-toastify";
import { socket } from "@/socket";
import { ReservationSocketMessage } from "@/types/ReservationSchema";
import { Seat } from "@/types/SeatSchema";

function MatchPage() {
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[] | null>(null);

  const navigate = useNavigate();
  const user = useUserStore((state) => state.username);
  const { matchId } = useParams();

  const { mutate: startSession } = useMutation({
    mutationFn: async () => {
      return startMatchBookingSession(matchId!);
    },
    onSuccess: (data) => {
      console.log("data", data);
      setSessionId(data.id);
      setExpiresAt(data.expiresAt);
      toast.success("Match booking Session Successfully started");
    },
    onError(error) {
      console.log("error", error.message);
      toast.error(error.message as unknown as string);
      if (!user || user === null) {
        navigate("/register");
      } else {
        navigate("/");
      }
    },
  });

  const { mutate: bookSeatMutate, isPending: isBooking } = useMutation({
    mutationFn: async (seatId: number) => {
      if (!sessionId) return;
      return await bookSeat(sessionId, seatId);
    },
    onError: () => {
      toast.error("Couldn't book seat");
    },
  });

  const { mutate: unBookSeatMutate, isPending: isUnBooking } = useMutation({
    mutationFn: async (seatId: number) => {
      if (!sessionId) return;
      return await unBookSeat(sessionId, seatId);
    },
    onError: () => {
      toast.error("Couldn't unbook seat");
    },
  });

  const {mutate: completeReservationMutate, isPending: isCompleting} = useMutation({
    mutationFn: async () => {
      if (!sessionId) return;
      return await completeReservation(sessionId);
    },
    onSuccess: () => {
      toast.success("Reservation completed successfully");
      navigate("/");
    },
    onError: () => {
      toast.error("Couldn't complete reservation");
    },
  });

  const endSession = () => {
    navigate("/");
  };

  const {
    data: match,
    isLoading,
    isError,
    isFetched,
  } = useQuery({
    queryKey: [],
    queryFn: async () => await getMatchDetails(matchId!),
    enabled: !!matchId,
    // disable cache
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    // validate that the user is logged in
    if (!user || user === null) {
      navigate("/register");
    }

    if (isFetched && !isLoading && !isError) {
      startSession();
      setSeats(match!.seats)
    }
  }, [isFetched, isLoading, isError, user]);

  useEffect(() => {
    // update seats function
    const updateSeats = (value: ReservationSocketMessage) => {
      setSeats(value.data.seats)
      console.log(value);
    };

    // connect on socket to listen for updates
    if (sessionId !== null && match !== undefined) {
      socket.on(matchId!, updateSeats);
    }

    return () => {
      socket.off(matchId, updateSeats);
    };
  }, [sessionId, match, seats, matchId]);

  if (isError) return <p>Error fetching data</p>;
  if (isLoading || expiresAt === null || seats === null) return <p>Staring Session...</p>;

  return (
    <SeatBookingGrid
      width={match!.stadium.seatsPerRow}
      height={match!.stadium.rows}
      expiresAt={expiresAt}
      seats={seats!}
      bookSeat={bookSeatMutate}
      unBookSeat={unBookSeatMutate}
      endSession={endSession}
      completeReservation={completeReservationMutate}
      isPending={isBooking || isUnBooking || isCompleting}
    />
  );
}

export default MatchPage;
