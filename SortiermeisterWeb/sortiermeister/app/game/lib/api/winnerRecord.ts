export async function sendWinnerRecord(data: {
  playerName: string;
  time: number;
  algorithm: string;
  difficulty: number;
}) {
  await fetch("/api/winner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
