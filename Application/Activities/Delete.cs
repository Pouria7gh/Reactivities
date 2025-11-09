using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Activities;

public class Delete
{
    public class Command : IRequest
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
        private readonly DataContext _dataContext;
        public Handler(DataContext dataContext)
        {
            _dataContext = dataContext;
            
        }
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            await _dataContext.Activities.Where(x => x.Id == request.Id).ExecuteDeleteAsync();
        }
    }
}
