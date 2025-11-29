namespace RestAPI.Models
{
    public class WinnerRecord
    {
        public int ID { get; set; }
        public string Name { get; private set; }
        public  TimeSpan Time { get; private set; }
        public DateTime AchievedAt { get; private set; }

        public WinnerRecord(string name, TimeSpan time, DateTime achievedAt)
        {
            Name = name;
            Time = time;
            AchievedAt = achievedAt;
        }
        public WinnerRecord(string name, long time, DateTime achievedAt)
        {
            Name = name;
            Time = TimeSpan.FromMilliseconds(time);
            AchievedAt = achievedAt;
        }
    }
}