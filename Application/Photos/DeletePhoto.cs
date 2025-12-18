using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Photos;

public class DeletePhoto
{
    public class Command : IRequest<Result<Unit>>
    {
        public string PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly IPhotoAccessor _photoAccessor;
        private readonly DataContext _dataContext;
        private readonly IUserAccessor _userAccessor;
        public Handler(IPhotoAccessor photoAccessor, DataContext dataContext, IUserAccessor userAccessor)
        {
            _photoAccessor = photoAccessor;
            _dataContext = dataContext;
            _userAccessor = userAccessor;
        }
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _dataContext.Users.Include(x => x.Photos)
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

            if ( user == null ) return null;

            var photo = user.Photos.FirstOrDefault(x => x.Id == request.PublicId);

            if (photo == null) return null;

            var photoDeleteResult = await _photoAccessor.DeletePhoto(photo.Id);

            if (photoDeleteResult == null) return Result<Unit>.Failure("Problem Deleting Photo");

            _dataContext.Photos.Remove(photo);
            
            return await _dataContext.SaveChangesAsync() > 0 ? Result<Unit>.Success(Unit.Value) :
                Result<Unit>.Failure("Problem Deleting Photo");
        }
    }
}