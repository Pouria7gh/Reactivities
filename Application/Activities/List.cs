using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Presistence;

namespace Application.Activities;

public class List
{
    public class Query : IRequest<Result<PagedList<ActivityDto>>>
    {
        public ActivityListParams Params { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;
        public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _dataContext = dataContext;
            _mapper = mapper;
        }

        public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _dataContext.Activities
                .Where(a => a.Date >= request.Params.StartDate)
                .OrderByDescending(d => d.Date)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

            if (request.Params.IsGoing && !request.Params.IsHost)
            {
                query = query.Where(a => a.Attendees.Any(x => x.Username == _userAccessor.GetUserName()));
            }

            if (request.Params.IsHost && !request.Params.IsGoing)
            {
                query = query.Where(a => a.HostUsername == _userAccessor.GetUserName());
            }

            var activities = await PagedList<ActivityDto>.CreateAsync(query, request.Params.pageNumber, request.Params.PageSize);

            return Result<PagedList<ActivityDto>>.Success(activities);
        }
    }
}
