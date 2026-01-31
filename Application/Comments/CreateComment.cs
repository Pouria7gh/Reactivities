using Application.Activities;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Comments;

public class CreateComment
{
    public class Command : IRequest<Result<CommentDto>>
    {
        public string Body { get; set; }
        public Guid ActivityId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.Body).NotEmpty();
            RuleFor(c => c.ActivityId).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, Result<CommentDto>>
    {
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        public Handler(IUserAccessor userAccessor, DataContext dataContext, IMapper mapper)
        {
            _mapper = mapper;
            _dataContext = dataContext;
            _userAccessor = userAccessor;
        }

        private Activity _activity;
        private AppUser _appUser;
        private Comment _comment;
        private CommentDto _commentDto;

        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            try
            {
                await GetAppUserOrThrow();
                await GetActivityOrThrow(request.ActivityId);
                CreateComment(request);
                AddCommentToActivity();
                await PersistChanges();
                CreateCommentDto();
                return Result<CommentDto>.Success(_commentDto); 

            } catch (Exception error)
            {
                Console.WriteLine(error.Message);
                return Result<CommentDto>.Failure(error.Message);
            }
        }

        private async Task GetAppUserOrThrow()
        {
            var user = await _dataContext.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
            if (user == null)
            {
                throw new Exception("User not found");
            }
            _appUser = user;
        }
        private async Task GetActivityOrThrow(Guid activityId)
        {
            var activity = await _dataContext.Activities.Include(a => a.Comments)
                .FirstOrDefaultAsync(a => a.Id == activityId);
            if (activity == null)
            {
                throw new Exception("Activity not found");
            }
            _activity = activity;
        }
        private void CreateComment(Command request)
        {
            _comment = new Comment()
            {
                Activity = _activity,
                Author = _appUser,
                Body = request.Body,
                CreatedAt = DateTime.Now
            };
        }
        private void AddCommentToActivity()
        {
            _activity.Comments.Add(_comment);
        }
        private async Task PersistChanges()
        {
            var result = await _dataContext.SaveChangesAsync();
            if (result == 0)
            {
                throw new Exception("Problem adding comment");
            }
        }

        private void CreateCommentDto()
        {
            _commentDto = _mapper.Map<CommentDto>(_comment);
        }
    }
}