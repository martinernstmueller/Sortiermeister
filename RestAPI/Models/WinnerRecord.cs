namespace Projekt.Models
{
    public class WinnerRecord
    {
        public int ID;
        public string Name { get; }
        public  TimeSpan Time { get; }
        public DateTime AchievedAt { get; }

        public WinnerRecord(string name, TimeSpan time, DateTime date) 
        {
            Name = name;
            Time = time;
            AchievedAt = date;
        }
    }
}