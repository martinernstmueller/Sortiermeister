using Microsoft.EntityFrameworkCore;
using RestAPI.Models;
using RestAPI.Services;
using RestAPI.Database;

namespace ServicesUnitTests
{
    public class WinnerRecordServiceTests
    {
        private AppDbContext _DbContext;
        private WinnerRecordService _Service;
        private WinnerRecord CreateTestRecord(string name = "TestName", TimeSpan? time = null, DateTime? achievedAt = null)
        {
            return new WinnerRecord(name, time ?? TimeSpan.FromSeconds(120), achievedAt ?? DateTime.UtcNow);
        }
        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _DbContext = new AppDbContext(options);
            _Service = new WinnerRecordService(_DbContext);
        }
        [TearDown]
        public void TearDown()
        {
            _DbContext.Dispose();
        }
        [Test]
        public void CreateRecord_ValidRequest_ReturnsRecord()
        {
            var record = CreateTestRecord();
            var created = _Service.CreateRecord(record);
            Assert.Multiple(() =>
            {
                Assert.IsNotNull(created);
                Assert.That(created.Name, Is.EqualTo(record.Name));
                Assert.That(created.Time, Is.EqualTo(record.Time));
                Assert.That(created.AchievedAt, Is.EqualTo(record.AchievedAt));
                Assert.That(created.ID, Is.GreaterThan(0));
            });
        }
        [Test]
        public void GetRecordByID_ValidID_ReturnsRecord()
        {
            var record = CreateTestRecord();
            var created = _Service.CreateRecord(record);
            var fetched = _Service.GetRecordByID(created.ID);
            Assert.Multiple(() =>
            {
                Assert.IsNotNull(fetched);
                Assert.That(fetched.ID, Is.EqualTo(created.ID));
            });
        }
        [Test]
        public void GetRecordByID_InvalidID_ThrowsKeyNotFoundException()
        {
            Assert.Throws<KeyNotFoundException>(() => _Service.GetRecordByID(-1));
        }
        [Test]
        public void DeleteRecordByID_ValidID_RemovesAndReturnsRecord()
        {
            var record = CreateTestRecord();
            var created = _Service.CreateRecord(record);
            var deleted = _Service.DeleteRecordByID(created.ID);
            Assert.Multiple(() =>
            {
                Assert.IsNotNull(deleted);
                Assert.That(deleted.ID, Is.EqualTo(created.ID));
                Assert.Throws<KeyNotFoundException>(() => _Service.GetRecordByID(created.ID));
            });
        }
        [Test]
        public void DeleteRecordByID_InvalidID_ThrowsKeyNotFoundException()
        {
            Assert.Throws<KeyNotFoundException>(() => _Service.DeleteRecordByID(-1));
        }
        [Test]
        public void GetTopRecords_ValidRequest_ReturnsOrderedRecords()
        {
            var record1 = CreateTestRecord("A", TimeSpan.FromSeconds(100), DateTime.UtcNow.AddDays(-1));
            var record2 = CreateTestRecord("B", TimeSpan.FromSeconds(90), DateTime.UtcNow);
            _Service.CreateRecord(record1);
            _Service.CreateRecord(record2);

            var records = _Service.GetTopRecords(2);
            Assert.Multiple(() =>
            {
                Assert.That(records.Count, Is.EqualTo(2));
                Assert.That(records[0].Time, Is.LessThan(records[1].Time));
            });
        }
        [Test]
        public void GetTopRecords_NoRecords_ReturnsEmptyList()
        {
            var records = _Service.GetTopRecords(2);
            Assert.That(records, Is.Empty);
        }
        [Test]
        public void GetTopRecords_FilterByTimeFrame_ReturnsOnlyRecordsWithinRange()
        {
            var now = DateTime.UtcNow;
            var recordInRange = CreateTestRecord("InRange", TimeSpan.FromSeconds(100), now.AddDays(-1));
            var recordOutOfRange = CreateTestRecord("OutOfRange", TimeSpan.FromSeconds(90), now.AddDays(-10));
            _Service.CreateRecord(recordInRange);
            _Service.CreateRecord(recordOutOfRange);

            var records = _Service.GetTopRecords(10, now.AddDays(-2), now);
            Assert.Multiple(() =>
            {
                Assert.That(records.Count, Is.EqualTo(1));
                Assert.That(records[0].Name, Is.EqualTo("InRange"));
            });
        }
        [Test]
        public void GetTopRecords_LimitZero_ReturnsEmptyList()
        {
            var record = CreateTestRecord("A");
            _Service.CreateRecord(record);
            var records = _Service.GetTopRecords(0);
            Assert.That(records, Is.Empty);
        }
        [Test]
        public void GetTopRecords_LimitGreaterThanAvailable_ReturnsAllRecords()
        {
            var record1 = CreateTestRecord("A");
            var record2 = CreateTestRecord("B");
            _Service.CreateRecord(record1);
            _Service.CreateRecord(record2);
            var records = _Service.GetTopRecords(10);
            Assert.Multiple(() =>
            {
                Assert.That(records.Count, Is.EqualTo(2));
            });
        }
        [Test]
        public void GetTopRecords_LimitLessThanAvailable_ReturnsLimitedRecords()
        {
            var record1 = CreateTestRecord("A", TimeSpan.FromSeconds(100));
            var record2 = CreateTestRecord("B", TimeSpan.FromSeconds(90));
            _Service.CreateRecord(record1);
            _Service.CreateRecord(record2);
            var records = _Service.GetTopRecords(1);
            Assert.Multiple(() =>
            {
                Assert.That(records.Count, Is.EqualTo(1));
            });
        }
        [Test]
        public void GetTopRecords_BoundaryDates_IncludesRecordsOnBoundary()
        {
            var boundaryDate = DateTime.UtcNow.Date;
            var recordOnStart = CreateTestRecord("Start", TimeSpan.FromSeconds(100), boundaryDate);
            var recordOnEnd = CreateTestRecord("End", TimeSpan.FromSeconds(90), boundaryDate.AddDays(1));
            _Service.CreateRecord(recordOnStart);
            _Service.CreateRecord(recordOnEnd);
            var records = _Service.GetTopRecords(10, boundaryDate, boundaryDate.AddDays(1));
            Assert.Multiple(() =>
            {
                Assert.That(records.Count, Is.EqualTo(2));
                Assert.That(records.Any(r => r.Name == "Start"));
                Assert.That(records.Any(r => r.Name == "End"));
            });
        }
    }
}