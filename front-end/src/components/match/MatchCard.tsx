import { Button } from "../shadcn/button";
import { Card, CardContent, CardFooter } from "../shadcn/card";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Match } from "@/types/MatchSchema";
import { useNavigate } from "react-router";
import { GiWhistle } from "react-icons/gi";
import { PiFlagCheckeredFill } from "react-icons/pi";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate();

  const bookMatch = () => {
    navigate(`/match/${match.id}`);
  };

  const matchTime = new Date(match.matchDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={match.homeTeam.logo} width={50} height={50} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{match.homeTeam.name}</span>
          </div>
          <span className="font-bold">vs</span>
          <div className="flex items-center space-x-4">
            <span className="font-semibold">{match.awayTeam.name}</span>
            <Avatar>
              <AvatarImage src={match.homeTeam.logo} width={50} height={50} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center px-12">
          <div className="flex space-x-2 flex-1 text-gray-600 self-end">
            <GiWhistle />
            <p className="text-sm font-semibold">{match.mainReferee.name}</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-muted-foreground">{matchTime}</p>
            <p className="text-muted-foreground">{match.stadium.name}</p>
          </div>
          <div className="flex-1 justify-items-end">
            <div className="flex items-center space-x-2 flex-1 text-gray-600">
              <PiFlagCheckeredFill />
              <p className="text-sm font-semibold">{match.linesMan1.name}</p>
            </div>
            <div className="flex items-center space-x-2 flex-1 text-gray-600">
              <PiFlagCheckeredFill />
              <p className="text-sm font-semibold">{match.linesMan2.name}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={bookMatch}>
          Book Tickets
        </Button>
      </CardFooter>
    </Card>
  );
}
