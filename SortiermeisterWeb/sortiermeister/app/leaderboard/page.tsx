import PlayerRow from "./components/PlayerRow";
type Player = {
    id: number;
    name: string;
    time: string;
};

// async function getRanks() : Promise<Player[]> {
//     const res = await fetch("http://localhost:5000/api/leaderboard/ranks", { cache: "no-store" });
//     if (!res.ok) {
//         throw new Error("Failed to fetch leaderboard ranks");
//     }
//     return res.json();
// }
async function getRanks() {
  // Backend später → mock Daten
  return [
    { id: 1, name: "Player A", time: "00:00:01.234" },
    { id: 2, name: "Player B", time: "00:00:00.900" },
    { id: 3, name: "Player C", time: "00:00:02.500" },
    { id: 4, name: "Player D", time: "00:00:01.500" },
    { id: 5, name: "Player E", time: "00:00:00.800" },
    { id: 6, name: "Player F", time: "00:00:03.000" },
    { id: 7, name: "Player G", time: "00:00:01.100" },
    { id: 8, name: "Player H", time: "00:00:00.700" },
    { id: 9, name: "Player I", time: "00:00:04.000" },
    { id: 10, name: "Player J", time: "00:00:00.600" },
  ];
}


export default async function LeaderboardPage() {
    const data = await getRanks();
    const sortedRanks = data.sort((a, b) => a.time.localeCompare(b.time));

    const rankedPlayers = sortedRanks.map((player, index) => ({
        ...player,
        rank: index + 1,

    }));
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full 
                        bg-gradient-to-br from-zinc-900 via-black to-zinc-900 py-10 px-4">
            <div className="w-full max-w-4xl">
                <h1 className="text-5xl font-bold text-white mb-8 text-center tracking-tight">
                    Leaderboard
                </h1>
                
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl border border-zinc-700 
                                shadow-2xl p-6 overflow-hidden">
                    <div className="overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                        <div className="space-y-3">
                            {rankedPlayers.map((player) => (
                                <PlayerRow 
                                    key={player.rank} 
                                    rank={player.rank} 
                                    name={player.name} 
                                    time={player.time}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}