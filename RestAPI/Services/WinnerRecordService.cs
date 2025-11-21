using RestAPI.Models;

namespace RestAPI.Services
{
    public class WinnerRecordService
    {
        public WinnerRecordService() { }
        public WinnerRecord CreateRecord(WinnerRecord request) 
        {
            WinnerRecord record = new(request.Name, request.Time, request.AchievedAt);
            return record;
        }
        public WinnerRecord GetRecordByID(int id)
        {
            WinnerRecord record = new("placeholder", new TimeSpan(), new DateTime());
            return record;
        }
    }
}
