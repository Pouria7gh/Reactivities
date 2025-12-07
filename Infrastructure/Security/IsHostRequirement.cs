using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Infrastructure.Security;

public class IsHostRequirement : IAuthorizationRequirement
{   
}

public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
{
    private readonly DataContext _dataContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext dataContext)
    {
        _httpContextAccessor = httpContextAccessor;
        _dataContext = dataContext;
    }
    protected  override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null) return Task.CompletedTask;

        var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request
            .RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString());

        var attendee = _dataContext.ActivityAttendees
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.ActivityId == activityId && x.AppUserId == userId).Result;

        if (attendee == null) return Task.CompletedTask;

        if (attendee.IsHost) context.Succeed(requirement);

        return Task.CompletedTask;
    }
}