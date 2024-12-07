import {
  SignupStep1Values,
  SignupStep1Schema,
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
import {
  MUI_RADIO_STYLE,
  MUI_LABEL_STYLE,
  MUI_DATEPICKER_STYLE,
} from "@/constants/MUICustomization";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { Button } from "@/components/shadcn/button";

type SignupStep1Props = {
  signup1Data?: SignupStep1Values;
  nextStep: () => void;
  setData: React.Dispatch<
    React.SetStateAction<Partial<SignupValues> | undefined>
  >;
};

/**
 * SignupStep1 renders the form for the first step in the signup process
 * @param props holds the data needed to proceed in the signup process
 *              - **signup1Data:** so the user can save the signup data
 *              - **nextStep:** renders the new step for the signup
 *              - **setData:** sets the data of signup for the parent component
 */
function SignupStep1({ signup1Data, nextStep, setData }: SignupStep1Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<SignupStep1Values>({
    resolver: zodResolver(SignupStep1Schema),
    defaultValues: signup1Data,
  });

  const onSubmit: SubmitHandler<SignupStep1Values> = (data) => {
    setData((prevState) => ({ ...prevState, step1Data: data }));
    nextStep();
  };

  const genderComponents = [
    <FormControlLabel
      value="male"
      control={<Radio sx={MUI_RADIO_STYLE} />}
      label="Male"
      sx={MUI_LABEL_STYLE}
      key={1}
    />,
    <FormControlLabel
      value="female"
      control={<Radio sx={MUI_RADIO_STYLE} />}
      label="Female"
      sx={MUI_LABEL_STYLE}
      key={2}
    />,
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-x-3 gap-y-1 p-3"
    >
      <h2 className="col-span-2 text-xl font-bold">Personal Data</h2>
      <LabelInputContainer error={errors.firstName?.message}>
        <Label className="text-md" htmlFor="firstName">
          First Name
        </Label>
        <Input
          placeholder="Enter your first name"
          id="firstName"
          {...register("firstName")}
        />
      </LabelInputContainer>
      <LabelInputContainer error={errors.lastName?.message}>
        <Label className="text-md" htmlFor="lastName">
          Last Name
        </Label>
        <Input
          placeholder="Enter your last name"
          id="lastName"
          {...register("lastName")}
        />
      </LabelInputContainer>
      <LabelInputContainer error={errors.gender?.message}>
        <Label className="text-md">Gender</Label>
        <FormControl component="fieldset">
          <Controller
            name="gender"
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
                {genderComponents}
              </RadioGroup>
            )}
          />
        </FormControl>
      </LabelInputContainer>
      <LabelInputContainer error={errors.birthDate?.message}>
        <Label className="text-md">Birthdate</Label>
        <FormControl component="fieldset" error={!!errors?.birthDate}>
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <DesktopDatePicker
                {...field}
                onChange={(value) => field.onChange(value)}
                sx={MUI_DATEPICKER_STYLE}
              />
            )}
          />
        </FormControl>
      </LabelInputContainer>
      <LabelInputContainer className="col-span-2" error={errors.city?.message}>
        <Label className="text-md" htmlFor="city">
          City
        </Label>
        <Input
          placeholder="Please enter your city"
          id="city"
          {...register("city")}
        />
      </LabelInputContainer>
      <div className="col-span-2 mt-5 flex justify-end px-5">
        <Button type="submit" className="px-10 text-md" variant="outline">
          Next
        </Button>
      </div>
    </form>
  );
}

export default SignupStep1;
