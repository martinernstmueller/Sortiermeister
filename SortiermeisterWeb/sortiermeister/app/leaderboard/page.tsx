import PlayerRow from "./components/PlayerRow";
type Player = {
    id: number;
    name: string;
    time: number;
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
    { id: 1, name: "Player A", time: 1234 },
    { id: 2, name: "Player B", time: 900 },
    { id: 3, name: "Player C", time: 2500 },
    { id: 4, name: "Player D", time: 1500 },
    { id: 5, name: "Player E", time: 800 },
    { id: 6, name: "Player F", time: 3000 },
    { id: 7, name: "Player G", time: 1100 },
    { id: 8, name: "Player H", time: 700 },
    { id: 9, name: "Player I", time: 4000 },
    { id: 10, name: "Player J", time: 600 },
  ];
}


export default async function LeaderboardPage() {
    const data = await getRanks();
    const sortedRanks = data.sort((a, b) => a.time - b.time);

    const rankedPlayers = sortedRanks.map((player, index) => ({
        ...player,
        rank: index + 1,

    }));
    return (
        <div className="flex flex-col items-center pt-10 bg-gradient-to-b from-black via-slate-800 to-blue-300 h-screen w-screen">
            <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>
            <div className="w-3/4 h-5/6  rounded-xl flex flex-col items-center p-4 overflow-y-auto">
            {rankedPlayers.map((player) => (
                <PlayerRow key={player.rank} rank={player.rank} name={player.name} time={player.time}/>
            ))}
        </div>
</div>
    )
}