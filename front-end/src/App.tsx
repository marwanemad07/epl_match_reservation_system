// Providers
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

// Pages
import { HomeLayout, LandingPage, ErrorPage, RegisterPage } from "./pages";

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
      // { path: "", element: <LandingPage /> },
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
        <ToastContainer />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
