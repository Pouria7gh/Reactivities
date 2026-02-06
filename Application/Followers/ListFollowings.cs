using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Followers;

public class ListFollowings
{
    public class Query : IRequest<Result<List<Profiles.Profile>>>
    {
        public string Username { get; set; }
    }
    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(p => p.Username).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        public Handler(DataContext dataContext, IMapper mapper)
        {
            _mapper = mapper;
            _dataContext = dataContext;
        }
        public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var followings = await _dataContext.UserFollowings
                .Where(x => x.Observer.UserName == request.Username)
                .Select(x => x.Target)
                .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Result<List<Profiles.Profile>>.Success(followings);
        }
    }
}