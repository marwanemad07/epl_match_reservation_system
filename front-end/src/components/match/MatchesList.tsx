import { groupMatchesByDate, sortMatchesByDate } from "@/lib/utils";
import { Match } from "@/types/MatchSchema";
import { MatchCard } from "./MatchCard";
import { useEffect, useMemo } from "react";

type MatchesListProps = {
  matches: Match[];
};

const MatchesList = ({ matches }: MatchesListProps) => {
  const sortedMatches = useMemo(() => {
    console.log("matches", matches);
    if (!matches || matches.length == 0) return [];
    return sortMatchesByDate(matches);
  }, [matches]);

  const groupedMatches = useMemo(() => {
    console.log("sortedMatches", sortedMatches);
    if (!sortedMatches || sortedMatches.length == 0) return {};
    return groupMatchesByDate(sortedMatches);
  }, [sortedMatches]);

  useEffect(() => {
    console.log("groupedMatches", groupedMatches);
  }, [groupedMatches]);

  if (!groupedMatches || Object.keys(groupedMatches).length == 0) {
    return <div>No matches</div>;
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedMatches).map(([date, matches]) => (
        <div key={date} className="bg-muted rounded-lg p-4">
          <h2 className="text-2xl font-semibold mb-4">
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <div className="space-y-8">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchesList;
