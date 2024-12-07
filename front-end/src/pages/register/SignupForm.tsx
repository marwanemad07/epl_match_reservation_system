import { useState } from "react";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import { SignupStep2Values, SignupValues } from "@/types/SignupSchema";

/**
 * SignupForm renders the current signup step conditionally.
 * Handles saving the user data while navigating between steps
 * Handles making the user creation request
 */
function SignupForm() {
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [signupData, setSignupData] = useState<Partial<SignupValues>>();

  const signupUser = (data: SignupStep2Values) => {
    setSignupData((prevState) => ({ ...prevState, step2Data: data }));
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
          signupUser={signupUser}
        />
      )}
    </>
  );
}

export default SignupForm;
