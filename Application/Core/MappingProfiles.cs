using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, Activity>();
        
        CreateMap<Activity, ActivityDto>()
            .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
            .FirstOrDefault(x => x.IsHost).AppUser.UserName));
        
        CreateMap<AppUser, Profiles.Profile>()
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.Where(x => x.IsMain)
                .Select(x => x.Url).FirstOrDefault()));
        
        CreateMap<ActivityAttendee, AttendeeDto>()
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos
                .Where(p => p.IsMain).Select(x => x.Url).FirstOrDefault()));

        CreateMap<Comment, CommentDto>()
            .ForMember(c => c.Username, o => o.MapFrom(s => s.Author.Id))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos
                .Where(p => p.IsMain).Select(x => x.Url).FirstOrDefault()));
    }
}
