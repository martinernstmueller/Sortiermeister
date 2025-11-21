namespace RestAPI.Models
{
    public class WinnerRecord
    {
        public int ID;
        public string Name { get; private set; }
        public  TimeSpan Time { get; private set; }
        public DateTime AchievedAt { get; private set; }

        public WinnerRecord(string name, TimeSpan time, DateTime achievedAt)
        {
            Name = name;
            Time = time;
            AchievedAt = achievedAt;
        }
    }
}