import { useUserStore } from "@/stores/userStore";
import { SeatState } from "@/types/ReservationSchema";

type GridSeatProps = {
  state: SeatState;
  bookingUserID: string | null;
  onClick: () => void;
};

const GridSeat = ({ state, bookingUserID, onClick }: GridSeatProps) => {
  const userId = useUserStore((state) => state.userId);
  const baseClasses =
    "w-full h-full rounded-md transition-colors duration-200 ease-in-out";
  const stateClasses = {
    AVAILABLE: "bg-green-500 hover:bg-green-600",
    CONFIRMED: "bg-red-500 cursor-not-allowed",
    TEMP_BOOKED: "bg-yellow-500 hover:bg-yellow-600",
  };

  return (
    <button
      className={`${baseClasses} ${stateClasses[(state === "TEMP_BOOKED" && bookingUserID != null && userId !== bookingUserID ? "CONFIRMED" : state) as keyof typeof stateClasses]}`}
      onClick={onClick}
      disabled={state === "CONFIRMED" || (state === "TEMP_BOOKED" && bookingUserID != null && userId !== bookingUserID)}
      aria-label={`Seat ${state}`}
    />
  );
};

export default GridSeat;
