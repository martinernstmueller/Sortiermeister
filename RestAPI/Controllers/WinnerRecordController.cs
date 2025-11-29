using Microsoft.AspNetCore.Mvc;
using RestAPI.DTO;
using RestAPI.Models;
using RestAPI.Services;
using RestAPI.Utilities;

namespace RestAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WinnerRecordController : BaseController
    {
        private readonly IWinnerRecordService _Service;
        public WinnerRecordController(IWinnerRecordService service) : base() =>
            _Service = service;

        [HttpPost]
        public IActionResult CreateWinnerRecord([FromBody] CreateWinnerRecordDto request)
        {
            try
            {
                Validator.ValidateWinnerRecord(request);
                var record = _Service.CreateRecord(request);
                return CreatedAtRoute(
                    routeName: "GetWinner",
                    routeValues: new { id = record.ID },
                    value: record
                );
            }
            catch (ArgumentException aEx)
            {
                return BadRequest(aEx.Message);
            }
            catch (Exception ex)
            {
                return HandleInternalError(ex);
            }
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteRecord(int id)
        {
            try
            {
                return Ok(_Service.DeleteRecordByID(id));
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return HandleInternalError(ex);
            }
        }

        [HttpGet("{id}", Name = "GetWinner")]
        public IActionResult GetRecord(int id)
        {
            try
            {
                return Ok(_Service.GetRecordByID(id));
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return HandleInternalError(ex);
            }
        }

        [HttpGet]
        public IActionResult GetTopRecords(
                [FromQuery] int? limit,
                [FromQuery] DateTime? startDate,
                [FromQuery] DateTime? endDate
            )
        {
            try
            {
                var records = _Service.GetTopRecords(
                    limit,
                    startDate,
                    endDate
                );
                return Ok(records);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return HandleInternalError(ex);
            }
        }
    }
}