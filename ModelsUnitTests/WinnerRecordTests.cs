using RestAPI.Models;

namespace ModelsUnitTests
{
    public class WinnerRecordTests
    {
        [Test]
        [TestCaseSource(nameof(_Records))]
        public void Constructor_CreateObject_CorrectValuesForAttributes(string name, TimeSpan time, DateTime date)
        {
            WinnerRecord record = new(name, time, date);
            Assert.Multiple(() => {
                Assert.That(record.Name, Is.EqualTo(name));
                Assert.That(record.Time, Is.EqualTo(time));
                Assert.That(record.AchievedAt, Is.EqualTo(date));
            });
        }
        private static object[] _Records =
        {
            new object[] { "winner", new TimeSpan(0, 0, 50 ), new DateTime(2025, 11, 20) },
            new object[] { "steven", new TimeSpan(0, 1, 50 ), new DateTime(2025, 11, 21) },
            new object[] { "seb", new TimeSpan(10, 20, 50 ), new DateTime(2025, 11, 30) }
        };
    }
}