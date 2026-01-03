using API.DTOs;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
    [HttpGet("{username}")]
    public async Task<IActionResult> GetProfile(string username)
    {
        return HandleResult(await Send(new ProfileDetails.Query {Username = username}));
    }

    [HttpPost("updateProfile")]
    public async Task<IActionResult> UpdateProfile(ProfileUpdateDto profileDto)
    {
        return HandleResult(await Send(new ProfileUpdate.Command {
            DisplayName = profileDto.DisplayName,
            Bio = profileDto.Bio
        }));
    }
}