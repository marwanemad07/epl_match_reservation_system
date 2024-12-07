import {
  SignupStep2Values,
  SignupStep2Schema,
  SignupValues,
} from "@/types/SignupSchema";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LabelInputContainer from "@/components/LabelInputContainer";
import { Label } from "@/components/shadcn/label";
import { Input } from "@/components/shadcn/input";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { MUI_RADIO_STYLE, MUI_LABEL_STYLE } from "@/constants/MUICustomization";
import { Button } from "@/components/shadcn/button";

type SignupStep2Props = {
  signup2Data?: SignupStep2Values;
  prevStep: () => void;
  setData: React.Dispatch<
    React.SetStateAction<Partial<SignupValues> | undefined>
  >;
  signupUser: (data: SignupStep2Values) => void;
};

/**
 * SignupStep2 renders the form for the last step in the signup process
 * @param props holds the functions needed to create a user
 *              - **signup2Data:** so the user can save the signup data
 *              - **setData:** sets the data of signup for the parent component
 *              - **prevStep:** navigates back to the first step in signup
 *              - **signupUser:** creates a new user with userMutation
 */
function SignupStep2({
  signup2Data,
  setData,
  prevStep,
  signupUser,
}: SignupStep2Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    getValues,
  } = useForm<SignupStep2Values>({
    resolver: zodResolver(SignupStep2Schema),
    defaultValues: signup2Data,
  });

  const handleBack = () => {
    setData((prevState) => ({ ...prevState, step2Data: getValues() }));
    console.log(getValues());

    prevStep();
  };

  const onSubmit: SubmitHandler<SignupStep2Values> = (data) => {
    signupUser(data);
  };

  const roleComponents = [
    <FormControlLabel
      value="customer"
      control={<Radio sx={MUI_RADIO_STYLE} />}
      label="Customer"
      sx={MUI_LABEL_STYLE}
      key={1}
    />,
    <FormControlLabel
      value="admin"
      control={<Radio sx={MUI_RADIO_STYLE} />}
      label="Admin"
      sx={MUI_LABEL_STYLE}
      key={2}
    />,
    <FormControlLabel
      value="EFA"
      control={<Radio sx={MUI_RADIO_STYLE} />}
      label="EFA"
      sx={MUI_LABEL_STYLE}
      key={3}
    />,
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-x-3 gap-y-1 p-3"
    >
      <h2 className="col-span-2 text-xl font-bold">Account Data</h2>
      <LabelInputContainer
        className="col-span-2"
        error={errors.username?.message}
      >
        <Label className="text-md" htmlFor="username">
          Username
        </Label>
        <Input
          placeholder="Enter your username"
          id="username"
          {...register("username")}
        />
      </LabelInputContainer>
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
      <LabelInputContainer className="col-span-2" error={errors.role?.message}>
        <Label className="text-md">Role</Label>
        <div className="ml-5">
          <FormControl component="fieldset" error={!!errors?.role}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  style={{
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  {roleComponents}
                </RadioGroup>
              )}
            />
          </FormControl>
        </div>
      </LabelInputContainer>
      <div className="col-span-2 mt-5 flex justify-end gap-5 px-5">
        <Button
          type="button"
          className="px-10 text-md"
          onClick={handleBack}
          variant="outline"
        >
          Back
        </Button>
        <Button type="submit" className="px-10 text-md" variant="outline">
          Signup
        </Button>
      </div>
    </form>
  );
}

export default SignupStep2;
