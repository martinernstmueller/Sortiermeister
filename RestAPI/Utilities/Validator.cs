using RestAPI.Models;

namespace RestAPI.Utilities
{
    public class Validator
    {
        public static void ValidateWinnerRecord(WinnerRecord record)
        {
            if (record == null)
                throw new ArgumentNullException(nameof(record), "WinnerRecord cannot be null.");

            if (string.IsNullOrWhiteSpace(record.Name))
                throw new ArgumentException("Name must not be empty.", nameof(record.Name));

            if (record.Time <= TimeSpan.Zero)
                throw new ArgumentException("Time must be a positive value.", nameof(record.Time));

            if (record.AchievedAt == default)
                throw new ArgumentException("AchievedAt must be a valid date.", nameof(record.AchievedAt));
        }
    }
}