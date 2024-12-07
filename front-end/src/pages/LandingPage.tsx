import { useEffect } from "react";

function LandingPage() {
  useEffect(() => {
    document.title = "Tickestria";
  }, []);

  return <main>LandingPage</main>;
}

export default LandingPage;
