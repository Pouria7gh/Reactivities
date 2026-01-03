using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Profiles;

public class ProfileUpdate
{
    public class Command : IRequest<Result<Unit>>
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.DisplayName).MinimumLength(2).MaximumLength(100).NotEmpty();
            RuleFor(x => x.Bio).MaximumLength(300);
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

            if (user == null) return null;

            user.DisplayName = request.DisplayName;
            user.Bio = request.Bio;

            return await _dataContext.SaveChangesAsync() > 0 ?
                Result<Unit>.Success(Unit.Value) :
                Result<Unit>.Failure("Problem Updating Profile");
        }
    }
}