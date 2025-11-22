using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RestAPI.Models;
using RestAPI.Services;
using RestAPI.Utilities;

namespace RestAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WinnerRecordController : BaseController
    {
        private readonly WinnerRecordService _Service;
        public WinnerRecordController(WinnerRecordService service) : base()
        {
            _Service = service;
        }
        [HttpPost]
        public IActionResult CreateWinnerRecord([FromBody] WinnerRecord request)
        {
            try
            {
                Validator.ValidateString(request.Name, nameof(request.Name));
                WinnerRecord record = _Service.CreateRecord(request);
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
        [HttpGet("{id}", Name = "GetWinner")]
        public IActionResult GetRecord(int id)
        {
            try
            {
                WinnerRecord record = _Service.GetRecordByID(id);
                return Ok(record);
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