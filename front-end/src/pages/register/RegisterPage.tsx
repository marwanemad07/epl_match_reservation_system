import { Card } from "@/components/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import { useNavigation } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useEffect } from "react";

/**
 * RegisterPage renders the background and the signup & login tabs
 */
function RegisterPage() {
  const navigation = useNavigation();
  const isLogin = navigation.state;

  useEffect(() => {
    document.title = "Tickestria - Registration";
  }, []);

  return (
    <main className="h-screen w-screen bg-[url('/registerBg.jpeg')] bg-cover grid grid-cols-12">
      <Card className="relative top-1/2 -translate-y-1/2 w-[32rem] col-start-2 p-5 h-fit">
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
