using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.IdentityModel.Tokens.Experimental;

namespace Application.Common;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
        
    }
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var context = new ValidationContext<TRequest>(request);

        var validationResults = await Task.WhenAll(_validators.Select(validator => validator.ValidateAsync(context)));

        var errors = validationResults
            .Where(result => !result.IsValid)
            .SelectMany(result => result.Errors);

        if (errors.Any())
        {
            throw new ValidationException(errors);
        }

        var result = await next(cancellationToken);

        return result;
    }
}
