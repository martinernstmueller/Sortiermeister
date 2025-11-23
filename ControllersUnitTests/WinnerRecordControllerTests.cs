using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using RestAPI.Controllers;
using RestAPI.Models;
using RestAPI.Services;
using RestAPI.Database;

namespace ControllersUnitTests
{
    public class WinnerRecordControllerTests
    {
        private AppDbContext _DbContext;
        private WinnerRecordService _Service;
        private WinnerRecordController _Controller;
        private WinnerRecord CreateTestRecord(string name = "TestName", TimeSpan? time = null, DateTime? achievedAt = null)
        {
            return new WinnerRecord(name, time ?? TimeSpan.FromSeconds(120), achievedAt ?? DateTime.UtcNow);
        }
        private void AddRecordToDb(WinnerRecord record)
        {
            _DbContext.WinnerRecords.Add(record);
            _DbContext.SaveChanges();
        }
        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _DbContext = new AppDbContext(options);
            _Service = new WinnerRecordService(_DbContext);
            _Controller = new WinnerRecordController(_Service);
        }
        [TearDown]
        public void TearDown()
        {
            _DbContext.Dispose();
        }
        [Test]
        public void CreateWinnerRecord_ValidRequest_ReturnsCreatedAtRoute()
        {
            var testRecord = CreateTestRecord();
            var result = _Controller.CreateWinnerRecord(testRecord);
            var createdResult = result as CreatedAtRouteResult;
            Assert.IsNotNull(createdResult);
            Assert.Multiple(() =>
            {
                Assert.That(createdResult.RouteName, Is.EqualTo("GetWinner"));
                Assert.That(createdResult.Value, Is.TypeOf<WinnerRecord>());
                var returnedRecord = (WinnerRecord)createdResult.Value!;
                Assert.That(returnedRecord.Name, Is.EqualTo(testRecord.Name));
                Assert.That(returnedRecord.Time, Is.EqualTo(testRecord.Time));
                Assert.That(returnedRecord.AchievedAt, Is.EqualTo(testRecord.AchievedAt));
            });
        }
        [Test]
        public void CreateWinnerRecord_InvalidRequest_ReturnsBadRequest()
        {
            var invalidRecord = CreateTestRecord(null);
            var result = _Controller.CreateWinnerRecord(invalidRecord);
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
        [Test]
        public void GetRecord_ValidID_ReturnsOkWithRecord()
        {
            var record = CreateTestRecord();
            AddRecordToDb(record);
            var result = _Controller.GetRecord(record.ID);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.That(okResult.Value, Is.TypeOf<WinnerRecord>());
            var returnedRecord = (WinnerRecord)okResult.Value!;
            Assert.That(returnedRecord.ID, Is.EqualTo(record.ID));
        }
        [Test]
        public void GetRecord_InvalidID_ReturnsNotFound()
        {
            var result = _Controller.GetRecord(-1);
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }
        [Test]
        public void DeleteRecord_ValidID_ReturnsOk()
        {
            var record = CreateTestRecord();
            AddRecordToDb(record);
            var result = _Controller.DeleteRecord(record.ID);
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        [Test]
        public void DeleteRecord_InvalidID_ReturnsNotFound()
        {
            var result = _Controller.DeleteRecord(-1);
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }
        [Test]
        public void GetTopRecords_ValidRequest_ReturnsOkWithRecords()
        {
            var record1 = CreateTestRecord("A", TimeSpan.FromSeconds(100), DateTime.UtcNow.AddDays(-1));
            var record2 = CreateTestRecord("B", TimeSpan.FromSeconds(90), DateTime.UtcNow);
            AddRecordToDb(record1);
            AddRecordToDb(record2);
            var result = _Controller.GetTopRecords(2, null, null);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.That(okResult.Value, Is.TypeOf<List<WinnerRecord>>());
            var records = (List<WinnerRecord>)okResult.Value!;
            Assert.That(records.Count, Is.EqualTo(2));
        }
        [Test]
        public void GetTopRecords_FilterByTimeFrame_ReturnsOnlyRecordsWithinRange()
        {
            var now = DateTime.UtcNow;
            var recordInRange = CreateTestRecord("InRange", TimeSpan.FromSeconds(100), now.AddDays(-1));
            var recordOutOfRange = CreateTestRecord("OutOfRange", TimeSpan.FromSeconds(90), now.AddDays(-10));
            AddRecordToDb(recordInRange);
            AddRecordToDb(recordOutOfRange);
            var result = _Controller.GetTopRecords(10, now.AddDays(-2), now);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var records = (List<WinnerRecord>)okResult.Value!;
            Assert.That(records.Count, Is.EqualTo(1));
            Assert.That(records[0].Name, Is.EqualTo("InRange"));
        }
        [Test]
        public void GetTopRecords_NoRecords_ReturnsOkWithEmptyList()
        {
            var result = _Controller.GetTopRecords(2, null, null);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.That(okResult.Value, Is.TypeOf<List<WinnerRecord>>());
            var records = (List<WinnerRecord>)okResult.Value!;
            Assert.That(records, Is.Empty);
        }
        [Test]
        public void GetTopRecords_LimitZero_ReturnsEmptyList()
        {
            var record = CreateTestRecord("A");
            AddRecordToDb(record);
            var result = _Controller.GetTopRecords(0, null, null);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var records = (List<WinnerRecord>)okResult.Value!;
            Assert.That(records, Is.Empty);
        }
        [Test]
        public void GetTopRecords_LimitGreaterThanAvailable_ReturnsAllRecords()
        {
            var record1 = CreateTestRecord("A");
            var record2 = CreateTestRecord("B");
            AddRecordToDb(record1);
            AddRecordToDb(record2);
            var result = _Controller.GetTopRecords(10, null, null);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var records = (List<WinnerRecord>)okResult.Value!;
            Assert.That(records.Count, Is.EqualTo(2));
        }
        [Test]
        public void GetTopRecords_LimitLessThanAvailable_ReturnsLimitedRecords()
        {
            var record1 = CreateTestRecord("A", TimeSpan.FromSeconds(100));
            var record2 = CreateTestRecord("B", TimeSpan.FromSeconds(90));
            AddRecordToDb(record1);
            AddRecordToDb(record2);
            var result = _Controller.GetTopRecords(1, null, null);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var records = (List<WinnerRecord>)okResult.Value!;
            Assert.That(records.Count, Is.EqualTo(1));
        }
        [Test]
        public void GetTopRecords_BoundaryDates_IncludesRecordsOnBoundary()
        {
            var boundaryDate = DateTime.UtcNow.Date;
            var recordOnStart = CreateTestRecord("Start", TimeSpan.FromSeconds(100), boundaryDate);
            var recordOnEnd = CreateTestRecord("End", TimeSpan.FromSeconds(90), boundaryDate.AddDays(1));
            AddRecordToDb(recordOnStart);
            AddRecordToDb(recordOnEnd);
            var result = _Controller.GetTopRecords(10, boundaryDate, boundaryDate.AddDays(1));
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var records = (List<WinnerRecord>)okResult.Value!;
            Assert.That(records.Count, Is.EqualTo(2));
            Assert.That(records.Any(r => r.Name == "Start"));
            Assert.That(records.Any(r => r.Name == "End"));
        }
    }
}