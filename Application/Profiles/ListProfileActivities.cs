using System.Security.Cryptography.X509Certificates;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Profiles;

public class ListProfileActivities
{
    public class Query : IRequest<Result<List<ProfileActivityDto>>>
    {
        public string Predicate { get; set; } = "futureEvents";
        public string Username { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Username).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Query, Result<List<ProfileActivityDto>>>
    {
        private readonly DataContext _dataContext;
        private readonly IUserAccessor _userAccessor;
        public Handler(DataContext dataContext, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _dataContext = dataContext;
        }

        async Task<Result<List<ProfileActivityDto>>> IRequestHandler<Query, Result<List<ProfileActivityDto>>>.Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _dataContext.Activities.AsNoTracking()
                .OrderByDescending(x => x.Date)
                .Where(x => x.Attendees.Any(x => x.AppUser.UserName == request.Username));

            switch (request.Predicate)
            {
                case "futureEvents":
                    query = query.Where(x => x.Date >= DateTime.UtcNow);
                    break;
                case "pastEvents":
                    query = query.Where(x => x.Date < DateTime.UtcNow);
                    break;
                case "hosting":
                    query = query.Where(x => x.Attendees.Any(a => a.AppUser.UserName == request.Username && a.IsHost));
                    break;
            }

            var result = await query.Select(x => new ProfileActivityDto() 
                {Category = x.Category, Date = x.Date, Id = x.Id, Title = x.Title}).ToListAsync();

            return Result<List<ProfileActivityDto>>.Success(result);
        }
    }
}