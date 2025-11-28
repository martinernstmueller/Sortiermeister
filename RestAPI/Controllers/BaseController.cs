using Microsoft.AspNetCore.Mvc;

namespace RestAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase
    {
        protected IActionResult? ValidateModelState()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return null;
        }
        protected IActionResult HandleInternalError(Exception ex)
        {
            return StatusCode(500, "Internal server error: " + ex.Message);
        }
    }
}