using Microsoft.AspNetCore.Mvc;
using Moq;
using RestAPI.Controllers;
using RestAPI.Models;
using RestAPI.Services;

namespace ControllersUnitTests
{
    public class WinnerRecordControllerTests
    {
        private Mock<IWinnerRecordService> _ServiceMock;
        private WinnerRecordController _Controller;

        private WinnerRecord CreateTestRecord(string name = "TestName", TimeSpan? time = null, DateTime? achievedAt = null)
        {
            return new WinnerRecord(name, time ?? TimeSpan.FromSeconds(120), achievedAt ?? DateTime.UtcNow);
        }
        [SetUp]
        public void Setup()
        {
            _ServiceMock = new Mock<IWinnerRecordService>();
            _Controller = new WinnerRecordController(_ServiceMock.Object);
        }
        [Test]
        public void CreateWinnerRecord_ValidRequest_ReturnsCreatedAtRoute()
        {
            var testRecord = CreateTestRecord();
            _ServiceMock.Setup(s => s.CreateRecord(It.IsAny<WinnerRecord>())).Returns(testRecord);
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
            _ServiceMock.Setup(s => s.CreateRecord(It.IsAny<WinnerRecord>()))
                .Throws(new ArgumentException("Invalid record"));
            var result = _Controller.CreateWinnerRecord(invalidRecord);
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
        [Test]
        public void GetRecord_ValidID_ReturnsOkWithRecord()
        {
            var record = CreateTestRecord();
            _ServiceMock.Setup(s => s.GetRecordByID(record.ID)).Returns(record);
            var result = _Controller.GetRecord(record.ID);
            var okResult = result as OkObjectResult;
            Assert.Multiple(() =>
            {
                Assert.IsNotNull(okResult);
                Assert.That(okResult.Value, Is.TypeOf<WinnerRecord>());
                var returnedRecord = (WinnerRecord)okResult.Value!;
                Assert.That(returnedRecord.ID, Is.EqualTo(record.ID));
            });
        }
        [Test]
        public void GetRecord_InvalidID_ReturnsNotFound()
        {
            _ServiceMock.Setup(s => s.GetRecordByID(It.IsAny<int>()))
                .Throws(new KeyNotFoundException("Record not found"));
            var result = _Controller.GetRecord(-1);
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public void DeleteRecord_ValidID_ReturnsOk()
        {
            var record = CreateTestRecord();
            _ServiceMock.Setup(s => s.DeleteRecordByID(record.ID)).Returns(record);
            var result = _Controller.DeleteRecord(record.ID);
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }

        [Test]
        public void DeleteRecord_InvalidID_ReturnsNotFound()
        {
            _ServiceMock.Setup(s => s.DeleteRecordByID(It.IsAny<int>()))
                .Throws(new KeyNotFoundException("Record not found"));
            var result = _Controller.DeleteRecord(-1);
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public void GetTopRecords_ValidRequest_ReturnsOkWithRecords()
        {
            var record1 = CreateTestRecord("A", TimeSpan.FromSeconds(100), DateTime.UtcNow.AddDays(-1));
            var record2 = CreateTestRecord("B", TimeSpan.FromSeconds(90), DateTime.UtcNow);
            var records = new List<WinnerRecord> { record1, record2 };
            _ServiceMock.Setup(s => s.GetTopRecords(2, null, null)).Returns(records);
            var result = _Controller.GetTopRecords(2, null, null);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.Multiple(() =>
            {
                Assert.That(okResult.Value, Is.TypeOf<List<WinnerRecord>>());
                var returnedRecords = (List<WinnerRecord>)okResult.Value!;
                Assert.That(returnedRecords.Count, Is.EqualTo(2));
            });
        }

        [Test]
        public void GetTopRecords_FilterByTimeFrame_ReturnsOnlyRecordsWithinRange()
        {
            var now = DateTime.UtcNow;
            var recordInRange = CreateTestRecord("InRange", TimeSpan.FromSeconds(100), now.AddDays(-1));
            var records = new List<WinnerRecord> { recordInRange };
            _ServiceMock.Setup(s => s.GetTopRecords(10, now.AddDays(-2), now)).Returns(records);
            var result = _Controller.GetTopRecords(10, now.AddDays(-2), now);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.Multiple(() =>
            {
                var returnedRecords = (List<WinnerRecord>)okResult.Value!;
                Assert.That(returnedRecords.Count, Is.EqualTo(1));
                Assert.That(returnedRecords[0].Name, Is.EqualTo("InRange"));
            });
        }

        [Test]
        public void GetTopRecords_NoRecords_ReturnsOkWithEmptyList()
        {
            _ServiceMock.Setup(s => s.GetTopRecords(2, null, null)).Returns(new List<WinnerRecord>());
            var result = _Controller.GetTopRecords(2, null, null);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.Multiple(() =>
            {
                
                Assert.That(okResult.Value, Is.TypeOf<List<WinnerRecord>>());
                var returnedRecords = (List<WinnerRecord>)okResult.Value!;
                Assert.That(returnedRecords, Is.Empty);
            });
        }

        [Test]
        public void GetTopRecords_LimitZero_ReturnsEmptyList()
        {
            _ServiceMock.Setup(s => s.GetTopRecords(0, null, null)).Returns(new List<WinnerRecord>());
            var result = _Controller.GetTopRecords(0, null, null);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.Multiple(() =>
            {
                var returnedRecords = (List<WinnerRecord>)okResult.Value!;
                Assert.That(returnedRecords, Is.Empty);
            });
        }
        [Test]
        public void GetTopRecords_LimitGreaterThanAvailable_ReturnsAllRecords()
        {
            var record1 = CreateTestRecord("A");
            var record2 = CreateTestRecord("B");
            var records = new List<WinnerRecord> { record1, record2 };
            _ServiceMock.Setup(s => s.GetTopRecords(10, null, null)).Returns(records);
            var result = _Controller.GetTopRecords(10, null, null);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.Multiple(() =>
            {
                var returnedRecords = (List<WinnerRecord>)okResult.Value!;
                Assert.That(returnedRecords.Count, Is.EqualTo(2));
            });
        }
        [Test]
        public void GetTopRecords_LimitLessThanAvailable_ReturnsLimitedRecords()
        {
            var record1 = CreateTestRecord("A", TimeSpan.FromSeconds(100));
            var records = new List<WinnerRecord> { record1 };
            _ServiceMock.Setup(s => s.GetTopRecords(1, null, null)).Returns(records);
            var result = _Controller.GetTopRecords(1, null, null);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.Multiple(() =>
            {
                var returnedRecords = (List<WinnerRecord>)okResult.Value!;
                Assert.That(returnedRecords.Count, Is.EqualTo(1));
            });
        }
        [Test]
        public void GetTopRecords_BoundaryDates_IncludesRecordsOnBoundary()
        {
            var boundaryDate = DateTime.UtcNow.Date;
            var recordOnStart = CreateTestRecord("Start", TimeSpan.FromSeconds(100), boundaryDate);
            var recordOnEnd = CreateTestRecord("End", TimeSpan.FromSeconds(90), boundaryDate.AddDays(1));
            var records = new List<WinnerRecord> { recordOnStart, recordOnEnd };
            _ServiceMock.Setup(s => s.GetTopRecords(10, boundaryDate, boundaryDate.AddDays(1))).Returns(records);
            var result = _Controller.GetTopRecords(10, boundaryDate, boundaryDate.AddDays(1));
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.Multiple(() =>
            {
                var returnedRecords = (List<WinnerRecord>)okResult.Value!;
                Assert.That(returnedRecords.Count, Is.EqualTo(2));
                Assert.That(returnedRecords.Any(r => r.Name == "Start"));
                Assert.That(returnedRecords.Any(r => r.Name == "End"));
            });
        }
    }
}