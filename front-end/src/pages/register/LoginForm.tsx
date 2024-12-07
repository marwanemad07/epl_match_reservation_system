import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/shadcn/input";
import LabelInputContainer from "@/components/LabelInputContainer";
import { Label } from "@/components/shadcn/label";
import { LoginSchema, LoginValues } from "@/types/LoginSchema";
import { Button } from "@/components/shadcn/button";

function LoginForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(LoginSchema) });

  const onSubmit: SubmitHandler<LoginValues> = (data) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-x-3 gap-y-1 p-3 py-10"
    >
      <h2 className="col-span-2 text-xl font-bold">Login Data</h2>
      <LabelInputContainer
        className="col-span-2"
        error={errors.username?.message}
      >
        <Label className="text-md" htmlFor="username">
          Username
        </Label>
        <Input
          placeholder="Plese enter your username"
          id="username"
          {...register("username")}
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
          placeholder="Please enter your password"
          id="password"
          type="password"
          {...register("password")}
        />
      </LabelInputContainer>
      <div className="col-span-2 mt-5 flex justify-end px-5">
        <Button type="submit" className="px-10 text-md" variant="outline">
          Login
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
