using System.Linq;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class FollowingResolver : IValueResolver<UserActivity, AttendeeDto, bool>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public FollowingResolver(DataContext dataContext, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = dataContext;
        }

        public bool Resolve(UserActivity source, AttendeeDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(observer => observer.UserName == _userAccessor.GetCurrentUsername()).Result;
            if (currentUser.Followings.Any(following => following.TargetId == source.AppUserId))
                return true;

            return false;

        }
    }
}