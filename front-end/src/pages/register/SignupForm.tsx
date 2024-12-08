import { useState } from "react";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import { SignupStep2Values, SignupValues } from "@/types/SignupSchema";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "@/lib/requests/UserRequests";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

/**
 * SignupForm renders the current signup step conditionally.
 * Handles saving the user data while navigating between steps
 * Handles making the user creation request
 */
function SignupForm() {
  // States for the signup steps and data
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [signupData, setSignupData] = useState<Partial<SignupValues>>();

  // To redirect the user to home after registration
  const navigate = useNavigate();

  // Handling the user creation request
  const { mutate, isPending } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      toast.success("User created successfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error(`Error creating user: ${error.message}`);
    },
  });

  // Wrapper for the mutation function
  const handleUserSignup = (data: SignupStep2Values) => {
    const requestData = { ...signupData, step2Data: data } as SignupValues;
    setSignupData(requestData);
    mutate(requestData);
  };

  return (
    <>
      {signupStep === 1 ? (
        <SignupStep1
          signup1Data={signupData?.step1Data}
          nextStep={() => {
            setSignupStep(2);
          }}
          setData={setSignupData}
        />
      ) : (
        <SignupStep2
          signup2Data={signupData?.step2Data}
          prevStep={() => {
            setSignupStep(1);
          }}
          setData={setSignupData}
          signupUser={handleUserSignup}
          isPending={isPending}
        />
      )}
    </>
  );
}

export default SignupForm;
