import { Card } from "@/components/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import { useParams } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

function RegisterPage() {
  const { isLogin } = useParams();

  return (
    <main className="h-screen w-screen bg-[url('/registerBg.jpeg')] bg-cover grid grid-cols-10 grid-rows-10">
      <Card className="w-[32rem] col-start-2 row-start-2 row-end-10 p-5">
        <Tabs defaultValue={isLogin ? "login" : "signup"}>
          {/* TABS */}
          <TabsList className="w-full grid grid-cols-2 gap-3">
            <TabsTrigger value="signup" className="transition-all duration-300">
              Signup
            </TabsTrigger>
            <TabsTrigger value="login" className="transition-all duration-300">
              Login
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            {/* SIGNUP */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SignupForm />
            </LocalizationProvider>
          </TabsContent>
          <TabsContent value="login">
            {/* LOGIN */}
            <LoginForm />
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}

export default RegisterPage;
