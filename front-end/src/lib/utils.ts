import { useUserStore } from "@/stores/userStore";
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
