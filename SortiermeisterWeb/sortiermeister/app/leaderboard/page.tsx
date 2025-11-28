import PlayerRow from "./components/PlayerRow";
import { fetchFromAPI } from "../../api";

type WinnerRecord = {
    name: string;
    time: number; // This represents TimeSpan in milliseconds from the API
    achievedAt: string; // ISO date string
};

async function getRanks(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
): Promise<WinnerRecord[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    if (startDate) {
        params.append('startDate', startDate.toISOString());
    }
    if (endDate) {
        params.append('endDate', endDate.toISOString());
    }

    const res = await fetchFromAPI(`/api/WinnerRecord?${params.toString()}`, { 
        cache: "no-store" 
    });
    console.log(res);
    return res.map((record: WinnerRecord) => ({           
        name: record.name,      
        time: record.time,
        achievedAt: record.achievedAt
    }));
}

export default async function LeaderboardPage() {
    const data = await getRanks();

    const rankedPlayers = data.map((player, index) => ({
        ...player,
        rank: index + 1,
    }));
    
    return (
        <div className="flex flex-col items-center pt-10 bg-gradient-to-b from-black via-slate-800 to-blue-300 h-screen w-screen">
            <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>
            <div className="w-3/4 h-5/6 rounded-xl flex flex-col items-center p-4 overflow-y-auto">
                {rankedPlayers.map((player) => (
                    <PlayerRow 
                        key={player.rank} 
                        rank={player.rank} 
                        name={player.name} 
                        time={player.time} 
                        achievedAt={new Date(player.achievedAt)} 
                    />
                ))}
            </div>
        </div>
    )
}