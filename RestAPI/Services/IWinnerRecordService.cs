using RestAPI.Models;

namespace RestAPI.Services
{
    public interface IWinnerRecordService
    {
        WinnerRecord CreateRecord(WinnerRecord request);
        WinnerRecord DeleteRecordByID(int id);
        WinnerRecord GetRecordByID(int id);
        List<WinnerRecord> GetTopRecords(int? limit, DateTime? startDate = null, DateTime? endDate = null);
    }
}
