import MatchesList from "@/components/match/MatchesList";
import { getAllMatches } from "@/lib/requests/MatchesQueries";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function LandingPage() {
  const { data: matches, isLoading, isError } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => await getAllMatches(),
  });

  useEffect(() => {
    document.title = "Tickestria";
  }, []);

  useEffect(() => {
    console.log("data", matches);
  }, [matches]);

  return (
    <main>
      <div className="max-w-3xl mx-auto my-12">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching data</p>}
        {!isLoading && !isError  && <MatchesList matches={matches!} />}
      </div>
    </main>
  );
}

export default LandingPage;
