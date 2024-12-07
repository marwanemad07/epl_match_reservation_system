import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/shadcn/input";
import LabelInputContainer from "@/components/LabelInputContainer";
import { Label } from "@/components/shadcn/label";
import { SignupSchema, SignupValues } from "@/types/SignupSchema";

function LoginForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    // watch,
  } = useForm<SignupValues>({ resolver: zodResolver(SignupSchema) });

  const onSubmit: SubmitHandler<SignupValues> = (data) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-x-3 gap-y-1 p-3"
    >
      <LabelInputContainer className="col-span-2" error={errors.email?.message}>
        <Label className="text-md" htmlFor="email">
          Email
        </Label>
        <Input
          placeholder="e.g. example@mail.com"
          id="email"
          {...register("email")}
        />
      </LabelInputContainer>
      <LabelInputContainer
        className="col-span-2"
        error={errors.password?.message}
      >
        <Label className="text-md" htmlFor="password">
          Password
        </Label>
        <Input
          placeholder="example@mail.com"
          id="password"
          type="password"
          {...register("password")}
        />
      </LabelInputContainer>
    </form>
  );
}

export default LoginForm;
