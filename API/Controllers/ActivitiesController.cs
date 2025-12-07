using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetActivities()
    {
        return HandleResult(await Send(new List.Query()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetActivity(Guid id)
    {
        return HandleResult(await Send(new Details.Query { Id = id }));
    }

    [HttpPost]
    public async Task<IActionResult> CreateActivity(Activity activity)
    {
        return HandleResult(await Send(new Create.Command { Activity = activity }));
    }

    [Authorize("IsHost")]
    [HttpPut("{id}")]
    public async Task<IActionResult> EditActivity(Guid id, Activity activity)
    {
        activity.Id = id;
        return HandleResult(await Send(new Edit.Command { Activity = activity }));
    }

    [Authorize("IsHost")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivity(Guid id)
    {
        return HandleResult(await Send(new Delete.Command { Id = id }));
    }

    [HttpPost("{id}/attend")]
    public async Task<IActionResult> Attende(Guid id)
    {
        return HandleResult(await Send(new UpdateAttendance.Command {Id = id}));
    }
}