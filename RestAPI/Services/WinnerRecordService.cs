using RestAPI.Database;
using RestAPI.DTO;
using RestAPI.Models;

namespace RestAPI.Services
{
    public class WinnerRecordService : IWinnerRecordService
    {
        private readonly AppDbContext _Context;
        public WinnerRecordService(AppDbContext context) =>
            _Context = context;
        public WinnerRecord CreateRecord(CreateWinnerRecordDto request) =>
            _Context.WinnerRecords.Add(
                new WinnerRecord(request.Name, request.Time, request.AchievedAt)
            ).Entity is WinnerRecord record
                ? (_Context.SaveChanges(), record).record
                : throw new InvalidOperationException("Failed to create record.");
        public WinnerRecord DeleteRecordByID(int id) =>
            _Context.WinnerRecords.FirstOrDefault(s => s.ID == id) is WinnerRecord record
                ? (_Context.WinnerRecords.Remove(record), _Context.SaveChanges(), record).record
                : throw new KeyNotFoundException("Record not found.");
        public WinnerRecord GetRecordByID(int id) =>
            _Context.WinnerRecords.FirstOrDefault(s => s.ID == id)
                ?? throw new KeyNotFoundException("Record not found.");
        public List<WinnerRecord> GetTopRecords(
                int? limit,
                DateTime? startDate = null,
                DateTime? endDate = null
            )
        {
            var query = _Context.WinnerRecords.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(r => r.AchievedAt >= startDate.Value);
            if (endDate.HasValue)
                query = query.Where(r => r.AchievedAt <= endDate.Value);
            var orderedRecords = query.ToList()
                .OrderBy(r => r.Time)
                .ThenBy(r => r.AchievedAt);
            if (limit.HasValue)
                return orderedRecords.Take(limit.Value).ToList();
            else
                return orderedRecords.ToList();
        }
    }
}