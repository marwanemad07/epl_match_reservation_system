import { SeatState } from "@/types/ReservationSchema";
import { useState, useEffect, useCallback, useMemo } from "react";
import GridSeat from "./GridSeat";
import { Seat } from "@/types/SeatSchema";
import FadeLoader from "react-spinners/FadeLoader";
import { Button } from "../shadcn/button";
import { useUserStore } from "@/stores/userStore";
import { formatTime, getColumnLetter, getSecondsLeft } from "@/lib/utils";

type SeatBookingGridProps = {
  width: number;
  height: number;
  expiresAt: string;
  seats: Seat[];
  bookSeat: (seatId: number) => void;
  unBookSeat: (seatId: number) => void;
  endSession: () => void;
  completeReservation: () => void;
  isPending: boolean;
};

type SeatWithState = Seat & {
  state: SeatState;
};

const SeatBookingGrid = ({
  width,
  height,
  expiresAt,
  seats,
  bookSeat,
  unBookSeat,
  endSession,
  completeReservation,
  isPending,
}: SeatBookingGridProps) => {
  const [seatsClone, setSeats] = useState<SeatWithState[][] | null>(null);
  const [availableSeats, setAvailableSeats] = useState<number>(0);
  const [bookedSeats, setBookedSeats] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getSecondsLeft(expiresAt));

  const userId = useUserStore((state) => state.userId);
  const totalSeats = useMemo(() => width * height, [width, height]);

  const updateSeatStates = (seats: Seat[]) => {
    const newSeatsClone: SeatWithState[][] = [];
    let availableSeats = 0;
    let bookedSeats = 0;
    let selectedSeats = 0;
    seats.forEach((seat) => {
      const row = seat.row - 1;
      if (!newSeatsClone[row]) {
        newSeatsClone[row] = [];
      }

      const state =
        seat.reservations.length > 0
          ? seat.reservations[0].status
          : "AVAILABLE";

      if (state === "AVAILABLE") {
        availableSeats++;
      } else if (
        state === "CONFIRMED" ||
        (state === "TEMP_BOOKED" && seat.reservations[0].userId !== userId)
      ) {
        bookedSeats++;
      } else if (state === "TEMP_BOOKED") {
        selectedSeats++;
      }

      newSeatsClone[row].push({
        ...seat,
        state,
      });
    });

    setSeats(newSeatsClone);
    setAvailableSeats(availableSeats);
    setBookedSeats(bookedSeats);
    setSelectedSeats(selectedSeats);
  };

  const handleSeatClick = useCallback(
    (seatId: number) => {
      seatsClone!.flat().forEach((seat) => {
        if (seatId == seat.id) {
          if (seat.state === "AVAILABLE") {
            bookSeat(seat.id);
          } else if (seat.state === "TEMP_BOOKED") {
            unBookSeat(seat.id);
          }
        }
      });
    },
    [seatsClone]
  );

  useEffect(() => {
    updateSeatStates(seats);
  }, [seats]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(
        () => setTimeLeft(getSecondsLeft(expiresAt)),
        1000
      );
      return () => clearTimeout(timerId);
    } else {
      // Time's up! Reset temp_booked seats to available
      endSession();
    }
  }, [timeLeft]);

  if (!seatsClone) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Seat Booking</h1>
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner mb-4 flex flex-col items-center">
        <div className="flex justify-between items-center mb-4 gap-10">
          <div className="text-lg font-semibold">
            Time Left: {formatTime(timeLeft)}
          </div>
          <div className="text-lg font-semibold">
            Selected Seats: {selectedSeats}
          </div>
        </div>
        <div className="flex justify-center w-full">
          <div className="w-8"></div>
          {Array(width)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="w-10 h-8 m-1 flex items-center justify-center font-semibold"
              >
                {getColumnLetter(index)}
              </div>
            ))}
        </div>
        <div className="relative overflow-hidden rounded-lg">
          {isPending && (
            <div className="w-full h-full absolute bg-black opacity-35 grid place-items-center ml-10 pr-7 rounded-lg">
              <FadeLoader
                loading={true}
                color="#fff"
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}
          {seatsClone.map((row, i) => (
            <div key={i} className="flex justify-center w-full">
              <div className="w-8 h-10 m-1 flex items-center justify-center font-semibold">
                {i + 1}
              </div>
              {row.map((seat, j) => (
                <div
                  key={`${i}-${j}`}
                  className="w-10 h-10 m-1 flex items-center justify-center"
                >
                  <GridSeat
                    state={seat.state}
                    bookingUserID={
                      seat.reservations.length > 0
                        ? seat.reservations[0].userId
                        : null
                    }
                    onClick={() => handleSeatClick(seat.id)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Seat Information</h2>
          <p>Total Seats: {totalSeats}</p>
          <p>Available Seats: {availableSeats}</p>
          <p>Booked Seats: {bookedSeats}</p>
          <p>Selected Seats: {selectedSeats}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Legend</h2>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
            <span>Reserved For You</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={completeReservation}
          disabled={isPending || selectedSeats === 0}
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default SeatBookingGrid;
