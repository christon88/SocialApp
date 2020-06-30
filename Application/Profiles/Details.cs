using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Profile>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Profile>
        {
            private readonly DataContext _context;
            private readonly IProfileReader _profileReader;
            public Handler(DataContext context, IProfileReader profileReader)
            {
                _profileReader = profileReader;
                _context = context;
            }

            public async Task<Profile> Handle(Query request,
            CancellationToken cancellationToken)
            {
                return await _profileReader.ReadProfile(request.Username);
            }
        }
    }
}