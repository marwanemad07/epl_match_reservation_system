import { useUserStore } from "@/stores/userStore";
import { useNavigate } from "react-router-dom";
import ProfileBanner from "./ProfileBanner";
import { ParallaxProvider } from "react-scroll-parallax";
import { useEffect } from "react";

function ProfilePage() {
  // Zustand store to know the user's username
  const username = useUserStore((state) => state.username);
  const navigate = useNavigate();

  useEffect(() => {
    // redirect to the user if he's not logged in
    if (!username) {
      navigate("/register");
    }
  }, [navigate]);

  return (
    <main className="relative">
      <ParallaxProvider>
        <ProfileBanner />
      </ParallaxProvider>
      {/* <ProfileTickets /> */}
    </main>
  );
}

export default ProfilePage;
