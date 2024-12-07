import { useEffect } from "react";

function ErrorPage() {
  useEffect(() => {
    document.title = "Tickestria";
  }, []);

  return <div>ErrorPage</div>;
}

export default ErrorPage;
