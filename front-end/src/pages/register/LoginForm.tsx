import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/shadcn/input";
import LabelInputContainer from "@/components/LabelInputContainer";
import { Label } from "@/components/shadcn/label";
import { LoginSchema, LoginValues } from "@/types/LoginSchema";
import { Button } from "@/components/shadcn/button";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/requests/UserRequests";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * LoginForm renders the login tab.
 * Has the functionality to send the login request.
 */
function LoginForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<LoginValues>({ resolver: zodResolver(LoginSchema) });

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      toast.success(`Welcome back, ${getValues("username")}`);
      navigate("/");
      // TODO: may save user to the local storage and zustand store
    },
    onError: (error) => {
      const axiosError = error as any;
      toast.error(`Error logging user: ${axiosError?.response?.data.message}`);
    },
  });

  const onSubmit: SubmitHandler<LoginValues> = (data) => {
    mutate(data);
  };

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
        <Button
          type="submit"
          className="px-10 text-md"
          variant={isPending ? "ghost" : "outline"}
          disabled={isPending}
        >
          {isPending ? "Loading" : "Login"}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
