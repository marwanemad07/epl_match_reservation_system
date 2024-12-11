// React toastify styles
import "react-toastify/dist/ReactToastify.css";

// Providers
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slide, ToastContainer } from "react-toastify";

// Pages
import {
  HomeLayout,
  LandingPage,
  RegisterPage,
  ProfilePage,
  BookingPage,
  ErrorPage,
} from "./pages";

// Loaders
import { homeDataLoader } from "./pages/loaders";
import { TooltipProvider } from "./components/shadcn/tooltip";

// Tanstack Query configuration
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } }, // 5 minutes for auto refetch
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        // HOME PAGE
        index: true,
        element: <LandingPage />,
        loader: homeDataLoader(queryClient),
      },
      {
        // PROFILE PAGE
        path: "profile",
        element: <ProfilePage />,
      },
      { path: "match/:matchId/booking", element: <BookingPage /> },
    ],
    errorElement: <ErrorPage />,
  },
  { path: "/register", element: <RegisterPage /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <ToastContainer autoClose={1250} transition={Slide} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
