import { z } from "zod";

const SignupStep1Schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.date(),
  gender: z.string(),
  city: z.string(),
});

// Export the schema for use for form validation
export type SignupStep1Values = z.infer<typeof SignupStep1Schema>;
export { SignupStep1Schema };

const SignupStep2Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(4),
  role: z.union([z.literal("admin"), z.literal("EFA"), z.literal("customer")]), //
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
