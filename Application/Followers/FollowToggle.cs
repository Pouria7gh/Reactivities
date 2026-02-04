using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Followers;

public class FollowToggle
{
    public class Command : IRequest<Result<Unit>>
    {
        public string TargetUsername { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.TargetUsername).NotEmpty();
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
            var observer = await _dataContext.Users.FirstOrDefaultAsync(x => 
                x.UserName == _userAccessor.GetUserName());

            var target = await _dataContext.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);
        
            if (target == null) return null;

            var following = await _dataContext.UserFollowings.FindAsync(observer.UserName, target.UserName);
        
            if (following == null)
            {
                var newFollowing = new UserFollowing()
                {
                    Observer = observer,
                    Target = target
                };

                _dataContext.UserFollowings.Add(newFollowing);
            }
            else
            {
                _dataContext.UserFollowings.Remove(following);
            }

            var success = await _dataContext.SaveChangesAsync() > 0;

            if (success) return Result<Unit>.Success(Unit.Value);

            return Result<Unit>.Failure("Problem updating following");
        }
    }
}