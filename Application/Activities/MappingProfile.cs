using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
            .ForMember(destination => destination.Username, origin => origin.MapFrom(source => source.AppUser.UserName))
            .ForMember(destination => destination.DisplayName, origin => origin.MapFrom(source => source.AppUser.DisplayName));
        }
    }
}