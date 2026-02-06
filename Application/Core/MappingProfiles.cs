using Application.Activities;
using Application.Comments;
using Application.Interfaces;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    private readonly IUserAccessor _userAccessor;
    public MappingProfiles(IUserAccessor userAccessor)
    {
        _userAccessor = userAccessor;

        CreateMap<Activity, Activity>();
        
        CreateMap<Activity, ActivityDto>()
            .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
            .FirstOrDefault(x => x.IsHost).AppUser.UserName));
        
        CreateMap<AppUser, Profiles.Profile>()
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.Where(x => x.IsMain)
                .Select(x => x.Url).FirstOrDefault()))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s =>
                s.Followers.Any(x => x.Observer.UserName == _userAccessor.GetUserName())));
        
        CreateMap<ActivityAttendee, AttendeeDto>()
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos
                .Where(p => p.IsMain).Select(x => x.Url).FirstOrDefault()))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s => 
                s.AppUser.Followers.Any(x => x.Observer.UserName == _userAccessor.GetUserName())));

        CreateMap<Comment, CommentDto>()
            .ForMember(c => c.Username, o => o.MapFrom(s => s.Author.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos
                .Where(p => p.IsMain).Select(x => x.Url).FirstOrDefault()));
    }
}
