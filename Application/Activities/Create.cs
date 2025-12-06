using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Activities;

public class Create
{
    public class Command : IRequest<Result<Unit>>
    {
        public Activity Activity { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Activity)
                .SetValidator(new ActivityValidator())
                .OverridePropertyName("");
        }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _dataContext;
        private readonly IUserAccessor _userAccessor;
        public Handler(DataContext dataContext, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _dataContext = dataContext;
        }
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

            var attendee = new ActivityAttendee()
            {
                Activity = request.Activity,
                AppUser = user,
                IsHost = true
            };

            request.Activity.Attendees.Add(attendee);

            _dataContext.Activities.Add(request.Activity);

            var result = await _dataContext.SaveChangesAsync() > 0;

            if (!result) return Result<Unit>.Failure("Failed to create activity");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}