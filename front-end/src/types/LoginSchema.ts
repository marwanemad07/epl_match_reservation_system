import { z } from "zod";
import { PasswordSchema, UsernameSchema } from "./SignupSchema";

const LoginSchema = z.object({
  username: UsernameSchema,
  password: PasswordSchema,
});

// Export the schema for use for form validation
export type LoginValues = z.infer<typeof LoginSchema>;
export { LoginSchema };
