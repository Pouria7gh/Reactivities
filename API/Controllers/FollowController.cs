using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{targetUsername}")]
        public async Task<IActionResult> FollowToggle(string targetUsername)
        {
            var result = await Send(new FollowToggle.Command() {TargetUsername = targetUsername});
            return HandleResult(result);
        }
    }
}
