namespace RestAPI.DTO
{
    public class CreateWinnerRecordDto
    {
        public string Name { get; private set; }
        public long Time { get; private set; }
        public DateTime AchievedAt { get; private set; }
        public CreateWinnerRecordDto(string name, long time, DateTime achievedAt)
        {
            Name = name;
            Time = time;
            AchievedAt = achievedAt;
        }
    }
}
