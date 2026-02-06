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

        [HttpGet("{username}/Followers")]
        public async Task<IActionResult> GetFollowers(string username)
        {
            var followers = await Send(new ListFollowers.Query() {Username = username});
            return HandleResult(followers);
        }

        [HttpGet("{username}/Followings")]
        public async Task<IActionResult> GetFollowings(string username)
        {
            var followings = await Send(new ListFollowings.Query() {Username = username});
            return HandleResult(followings);
        }
    }
}
