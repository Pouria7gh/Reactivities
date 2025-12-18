using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Photos;

public class SetMainPhoto
{
    public class Command : IRequest<Result<Unit>>
    {
        public string PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _dataContext;
        private readonly IUserAccessor _userAccessor;
        public Handler(IUserAccessor userAccessor, DataContext dataContext)
        {
            _userAccessor = userAccessor;
            _dataContext = dataContext;
        }

        public class Validator : AbstractValidator<Command>
        {
            public Validator()
            {
                RuleFor(x => x.PublicId).NotEmpty();
            }
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _dataContext.Users.Include(x => x.Photos)
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
            
            if (user == null) return null;

            var selectedMainPhoto = user.Photos.FirstOrDefault(x => x.Id == request.PublicId);

            if (selectedMainPhoto == null) return null;

            var currentMainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);

            if (currentMainPhoto == selectedMainPhoto) return Result<Unit>.Success(Unit.Value);

            if (currentMainPhoto != null) currentMainPhoto.IsMain = false;

            selectedMainPhoto.IsMain = true;

            return await _dataContext.SaveChangesAsync() > 0 ? Result<Unit>.Success(Unit.Value) : 
                Result<Unit>.Failure("Problem updating main photo");
        }
    }
}