import { useUserStore } from "@/stores/userStore";
import { Match } from "@/types/MatchSchema";
import { clsx, type ClassValue } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sets the username in the useUserStore.
 * Removes the JWT from the cookies.
 */
export function logout() {
  useUserStore.setState({ username: null });
  document.cookie = ""; // TODO: clear cookies
  toast.success("Logged out successfully");
}

export function sortMatchesByDate(matches: Match[]): Match[] {
  return matches.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
}

export function groupMatchesByDate(matches: Match[]): Record<string, Match[]> {
  return matches.reduce((acc, match) => {
    const date = new Date(match.matchDate).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(match)
    return acc
  }, {} as Record<string, Match[]>)
}


export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getColumnLetter = (index: number) => String.fromCharCode(65 + index);

export const getSecondsLeft = (expiresAt: string) => {
  return Math.floor((new Date(expiresAt).getTime() - new Date().getTime()) / 1000);
}