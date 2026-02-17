using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Profiles;

public class ProfileDetails
{
    public class Query : IRequest<Result<Profile>>
    {
        public string Username { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Username).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Query, Result<Profile>>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dataContext;
        public Handler(DataContext dataContext, IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;
        }
        public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await _dataContext.Users
                .Include(x => x.Photos)
                .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Username == request.Username);

            return Result<Profile>.Success(user);
        }
    }
}