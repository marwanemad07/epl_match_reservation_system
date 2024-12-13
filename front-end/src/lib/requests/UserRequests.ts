import { SignupValues } from "@/types/SignupSchema";
import { customFetch } from "./CustomFetch";
import { LoginValues } from "@/types/LoginSchema";
import { User } from "@/types/UserTypes";

/**
 * Make an API call to create a new user. The new user must first be verified by the admin
 * @param userData - The user data to be created
 * @returns a promise with type void
 */
export const signupUser = async (userData: SignupValues): Promise<void> => {
  try {
    const data = { ...userData.step1Data, ...userData.step2Data };
    const response = customFetch.post("api/auth/register", data);
    return (await response).data;
  } catch (error) {
    console.error("Couldn't create user", error);
    throw error;
  }
};

/**
 * Make an API call to login a user. The user must first be verified by the admin.
 * @param userData - The user data to be logged in
 * @returns a promise with type void
 */
export const loginUser = async (
  userData: LoginValues
): Promise<{
  data: {
    user: User;
    token: string;
  };
  status: number;
}> => {
  try {
    const response = customFetch.post("api/auth/login", userData);
    return (await response).data;
  } catch (error) {
    console.error("Couldn't login user", error);
    throw error;
  }
};
