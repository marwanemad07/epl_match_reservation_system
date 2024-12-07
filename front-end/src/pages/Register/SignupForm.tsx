import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/shadcn/input";
import LabelInputContainer from "@/components/LabelInputContainer";
import { Label } from "@/components/shadcn/label";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { SignupSchema, SignupValues } from "@/types/SignupSchema";
import {
  MUI_DATEPICKER_STYLE,
  MUI_LABEL_STYLE,
  MUI_RADIO_STYLE,
} from "@/constants/MUICustomization";
import { Button } from "@/components/shadcn/button";
import { DesktopDatePicker } from "@mui/x-date-pickers";

function SignupForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    // watch,
  } = useForm<SignupValues>({ resolver: zodResolver(SignupSchema) });

  const onSubmit: SubmitHandler<SignupValues> = (data) => console.log(data);

  const roleComponents = [
    <FormControlLabel
      value="customer"
      control={<Radio sx={MUI_RADIO_STYLE} />}
      label="Customer"
      sx={MUI_LABEL_STYLE}
    />,
    <FormControlLabel
      value="admin"
      control={<Radio sx={MUI_RADIO_STYLE} />}
      label="Admin"
      sx={MUI_LABEL_STYLE}
    />,
    <FormControlLabel
      value="EFA"
      control={<Radio sx={MUI_RADIO_STYLE} />}
      label="EFA"
      sx={MUI_LABEL_STYLE}
    />,
  ];

  const genderComponents = [
    <FormControlLabel
      value="male"
      control={<Radio sx={MUI_RADIO_STYLE} />}
      label="Male"
      sx={MUI_LABEL_STYLE}
    />,
    <FormControlLabel
      value="female"
      control={<Radio sx={MUI_RADIO_STYLE} />}
      label="Female"
      sx={MUI_LABEL_STYLE}
    />,
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-x-3 gap-y-1 p-3"
    >
      <h2 className="col-span-2 text-xl">Personal Data</h2>
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
      <LabelInputContainer error={errors.role?.message}>
        <Label className="text-md">Gender</Label>
        <FormControl component="fieldset" error={!!errors?.gender}>
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
      <LabelInputContainer error={errors.role?.message}>
        <Label className="text-md">Birthdate</Label>
        <FormControl component="fieldset" error={!!errors?.birthDate}>
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <DesktopDatePicker
                {...field}
                format="MM/DD/YYYY"
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
      <div className="col-span-2 flex justify-center">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}

export default SignupForm;
