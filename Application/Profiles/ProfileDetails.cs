using Application.Core;
using Application.Interfaces;
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
        private readonly IUserAccessor _userAccessor;
        public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _userAccessor = userAccessor;
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