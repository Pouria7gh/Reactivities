using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Photos;

public class AddPhoto
{
    public class Command : IRequest<Result<Photo>>
    {
        public IFormFile Photo { get; set; }

    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Photo).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, Result<Photo>>
    {
        private readonly IPhotoAccessor _photoAccessor;
        private readonly DataContext _dataContext;
        private readonly IUserAccessor _userAccessor;
        public Handler(IPhotoAccessor photoAccessor, DataContext dataContext, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _dataContext = dataContext;
            _photoAccessor = photoAccessor;
        }
        public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _dataContext.Users.Include(x => x.Photos)
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

            if (user == null) return null;

            var photoUploadResult = await _photoAccessor.AddPhoto(request.Photo);

            var photo = new Photo
            {
                Id = photoUploadResult.PublicId,
                Url = photoUploadResult.Url,
                IsMain = !user.Photos.Any(),
                CreatedAt = DateTime.UtcNow
            };

            user.Photos.Add(photo);

            if(await _dataContext.SaveChangesAsync() > 0)
                return Result<Photo>.Success(photo);
            else
                return Result<Photo>.Failure("Problem adding photo");
        }
    }
}
