using RestAPI.Database;
using RestAPI.Models;

namespace RestAPI.Services
{
    public class WinnerRecordService
    {
        private readonly AppDbContext _Context;
        public WinnerRecordService(AppDbContext context)
        {
            _Context = context;
        }
        public WinnerRecord CreateRecord(WinnerRecord request) 
        {
            WinnerRecord record = new(request.Name, request.Time, request.AchievedAt);
            _Context.WinnerRecords.Add(record);
            _Context.SaveChanges();
            return record;
        }
        public WinnerRecord GetRecordByID(int id)
        {
            WinnerRecord? record = _Context.WinnerRecords.FirstOrDefault(s => s.ID == id);
            if (record == null) throw new KeyNotFoundException("Record not found.");
            return record;
        }
    }
}