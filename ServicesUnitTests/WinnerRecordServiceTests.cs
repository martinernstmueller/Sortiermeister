using Microsoft.EntityFrameworkCore;
using RestAPI.Database;
using RestAPI.DTO;
using RestAPI.Models;
using RestAPI.Services;

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
        private CreateWinnerRecordDto CreateTestDto(string name = "TestName", long? timeMs = null, DateTime? achievedAt = null)
        {
            return new CreateWinnerRecordDto(name, timeMs ?? 120000, achievedAt ?? DateTime.UtcNow);
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
            var recordDto = CreateTestDto();
            var created = _Service.CreateRecord(recordDto);
            Assert.Multiple(() =>
            {
                Assert.IsNotNull(created);
                Assert.That(created.Name, Is.EqualTo(recordDto.Name));
                Assert.That(created.Time, Is.EqualTo(TimeSpan.FromMilliseconds(recordDto.Time)));
                Assert.That(created.AchievedAt, Is.EqualTo(recordDto.AchievedAt));
                Assert.That(created.ID, Is.GreaterThan(0));
            });
        }
        [Test]
        public void GetRecordByID_ValidID_ReturnsRecord()
        {
            var recorDto = CreateTestDto();
            var created = _Service.CreateRecord(recorDto);
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
            var recordDto = CreateTestDto();
            var created = _Service.CreateRecord(recordDto);
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
            var recordDto1 = CreateTestDto("A", 1000, DateTime.UtcNow.AddDays(-1));
            var recordDto2 = CreateTestDto("B", 900, DateTime.UtcNow);
            _Service.CreateRecord(recordDto1);
            _Service.CreateRecord(recordDto2);

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
            var recorDtoInRange = CreateTestDto("InRange", 1000, now.AddDays(-1));
            var recordDtoOutOfRange = CreateTestDto("OutOfRange", 900, now.AddDays(-10));
            _Service.CreateRecord(recorDtoInRange);
            _Service.CreateRecord(recordDtoOutOfRange);

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
            var recordDto = CreateTestDto("A");
            _Service.CreateRecord(recordDto);
            var records = _Service.GetTopRecords(0);
            Assert.That(records, Is.Empty);
        }
        [Test]
        public void GetTopRecords_LimitGreaterThanAvailable_ReturnsAllRecords()
        {
            var recordDto1 = CreateTestDto("A");
            var recordDto2 = CreateTestDto("B");
            _Service.CreateRecord(recordDto1);
            _Service.CreateRecord(recordDto2);
            var records = _Service.GetTopRecords(10);
            Assert.Multiple(() =>
            {
                Assert.That(records.Count, Is.EqualTo(2));
            });
        }
        [Test]
        public void GetTopRecords_LimitLessThanAvailable_ReturnsLimitedRecords()
        {
            var recordDto1 = CreateTestDto("A", 1000);
            var recordDto2 = CreateTestDto("B", 900);
            _Service.CreateRecord(recordDto1);
            _Service.CreateRecord(recordDto2);
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
            var recordDtoOnStart = CreateTestDto("Start", 1000, boundaryDate);
            var recordDtoOnEnd = CreateTestDto("End", 900, boundaryDate.AddDays(1));
            _Service.CreateRecord(recordDtoOnStart);
            _Service.CreateRecord(recordDtoOnEnd);
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