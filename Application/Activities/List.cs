using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Presistence;

namespace Application.Activities;

public class List
{
    public class Query : IRequest<Result<PagedList<ActivityDto>>>
    {
        public PagingParams Params { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        public Handler(DataContext dataContext, IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;
        }

        public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _dataContext.Activities
                .OrderByDescending(d => d.Date)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

            var activities = await PagedList<ActivityDto>.CreateAsync(query, request.Params.pageNumber, request.Params.PageSize);

            return Result<PagedList<ActivityDto>>.Success(activities);
        }
    }
}
