import { z } from "zod";

export const PasswordSchema = z
  .string()
  .min(1, "Required")
  .min(8, "At least 8 characters");
export const UsernameSchema = z
  .string()
  .min(1, "Required")
  .min(4, "At least 4 characters");

const SignupStep1Schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Required")
    .min(3, "At least 3 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Required")
    .min(3, "At least 3 characters"),
  birthDate: z.date(),
  gender: z.union([
    z.literal("male", { message: "Required" }),
    z.literal("female"),
  ]),
  city: z.string().trim().min(1, "Required"),
});

// Export the schema for use for form validation
export type SignupStep1Values = z.infer<typeof SignupStep1Schema>;
export { SignupStep1Schema };

const SignupStep2Schema = z.object({
  email: z.string().min(1, "Required").email("Invalid Email"),
  password: PasswordSchema,
  username: UsernameSchema,
  role: z.union([
    z.literal("admin", { required_error: "Required" }),
    z.literal("EFA"),
    z.literal("customer"),
  ]), //
});

// Export the schema for use for form validation
export type SignupStep2Values = z.infer<typeof SignupStep2Schema>;
export { SignupStep2Schema };

const SignupSchema = z.object({
  step1Data: SignupStep1Schema,
  step2Data: SignupStep2Schema,
});

// Export the schema for use for form validation
export type SignupValues = z.infer<typeof SignupSchema>;
export { SignupSchema };
