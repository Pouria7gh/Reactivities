using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API.Extensions;

public static class MediatorExtensions
{
    public static async Task<TResponse> TrySend<TResponse>(this IMediator mediator, IRequest<TResponse> request, ModelStateDictionary modelState)
    {
        try
        {
            return await mediator.Send(request);
        }
        catch (ValidationException ex)
        {
            foreach (var error in ex.Errors)
            {
                modelState.AddModelError(error.PropertyName, error.ErrorMessage);
            }
            return default;
        }
    }
}
